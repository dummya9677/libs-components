import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useGetAgentsQuery,
  useLazyGetConversationHistoryQuery,
  useStartConversationMutation,
} from '../services/api';
import { streamChat } from '../services/chat/streamChat';
import type { HistoryMessage } from '../types';
import {
  findAgentAccess,
  findApplicationById,
  getApplicationsForDropdown,
  resolveApplicationAgent,
} from '../utils/applicationAgents';
import { useAuth } from './useAuth';

function createUserMessage(content: string, conversationId: string): HistoryMessage {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: 'user',
    content,
    createdAt: new Date().toISOString(),
    conversationId,
  };
}

function createPendingAssistantMessage(conversationId: string): HistoryMessage {
  return {
    id: `assistant-pending-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role: 'assistant',
    content: '',
    createdAt: new Date().toISOString(),
    conversationId,
    isPending: true,
  };
}

function createAssistantMessage(
  content: string,
  conversationId: string,
  suggestedQueries: string[] = [],
): HistoryMessage {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
    conversationId,
    actions: suggestedQueries.map((label) => ({
      label,
      variant: 'link' as const,
    })),
  };
}

function buildSessionKey(
  applicationName: string | null,
  agentSlug: string,
): string {
  return `${applicationName ?? ''}:${agentSlug}`;
}

/**
 * Agent chat lifecycle:
 * 1. GET /agents → resolve application + backend agent id
 * 2. POST /history/conversations/start → conversation_id for (username, app, agent)
 * 3. GET /history/conversations/{conversation_id} (empty on 404)
 * 4. POST /chat with application id, agent_id, message, conversation_id, user_id (username)
 */
export function useAgentChat(agentSlug: string, applicationName: string | null) {
  const { user, isAuthenticated } = useAuth();
  const { data: agents = [], isLoading: isLoadingAgents } = useGetAgentsQuery(
    undefined,
    { skip: !isAuthenticated },
  );
  const [startConversation] = useStartConversationMutation();
  const [fetchHistory] = useLazyGetConversationHistoryQuery();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [backendAgentId, setBackendAgentId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [streamingAnswer, setStreamingAnswer] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const sessionKeyRef = useRef('');
  const sessionBootstrappedRef = useRef('');
  const bootstrapAttemptRef = useRef(0);
  const isStreamingRef = useRef(false);

  const applications = getApplicationsForDropdown(agents, agentSlug);

  const syncConversationId = useCallback((nextConversationId: string | null) => {
    conversationIdRef.current = nextConversationId;
    setConversationId(nextConversationId);
  }, []);

  useEffect(() => {
    if (isStreamingRef.current) {
      return;
    }

    const attempt = ++bootstrapAttemptRef.current;
    let cancelled = false;

    if (!applicationName) {
      sessionKeyRef.current = '';
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    if (isLoadingAgents) {
      setIsLoadingSession(true);
      return () => {
        cancelled = true;
      };
    }

    const sessionKey = buildSessionKey(applicationName, agentSlug);
    const isNewSession = sessionKeyRef.current !== sessionKey;

    if (isNewSession) {
      sessionKeyRef.current = sessionKey;
      sessionBootstrappedRef.current = '';
      abortRef.current?.abort();
      syncConversationId(null);
      setBackendAgentId(null);
      setSessionError(null);
      setMessages([]);
      setStreamingAnswer('');
      setError(null);
      setIsStreaming(false);
      isStreamingRef.current = false;
    }

    const application = findApplicationById(applications, applicationName);
    const agentAccess = findAgentAccess(agents, applicationName, agentSlug);

    if (!application || !agentAccess) {
      setSessionError(
        application
          ? 'This agent is not available for the selected application.'
          : null,
      );
      setBackendAgentId(null);
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    const username = user?.name?.trim();
    if (!username) {
      setSessionError(null);
      setBackendAgentId(null);
      setIsLoadingSession(true);
      return () => {
        cancelled = true;
      };
    }

    if (
      sessionBootstrappedRef.current === sessionKey &&
      conversationIdRef.current
    ) {
      setBackendAgentId(agentAccess.id);
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    setBackendAgentId(agentAccess.id);
    setIsLoadingSession(true);
    setSessionError(null);

    const bootstrapSession = async () => {
      try {
        const started = await startConversation({
          userId: username,
          application: agentAccess.application,
          agentId: agentAccess.id,
        }).unwrap();

        if (cancelled || attempt !== bootstrapAttemptRef.current) return;

        syncConversationId(started.conversationId);

        try {
          const historyPage = await fetchHistory(started.conversationId).unwrap();
          if (!cancelled && attempt === bootstrapAttemptRef.current) {
            setMessages((prev) =>
              prev.length > 0 ? prev : historyPage.items,
            );
          }
        } catch {
          if (!cancelled && attempt === bootstrapAttemptRef.current) {
            setMessages((prev) => (prev.length > 0 ? prev : []));
          }
        }

        if (!cancelled && attempt === bootstrapAttemptRef.current) {
          sessionBootstrappedRef.current = sessionKey;
        }
      } catch (err) {
        if (!cancelled && attempt === bootstrapAttemptRef.current) {
          const message =
            err instanceof Error
              ? err.message
              : 'Failed to start a conversation for this application and agent.';
          setSessionError(message);
          syncConversationId(null);
          setMessages([]);
        }
      } finally {
        if (!cancelled && attempt === bootstrapAttemptRef.current) {
          setIsLoadingSession(false);
        }
      }
    };

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [
    agentSlug,
    applicationName,
    agents,
    applications,
    fetchHistory,
    isLoadingAgents,
    startConversation,
    syncConversationId,
    user?.name,
  ]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreamingRef.current) return;

      if (!applicationName) {
        setError('Select an application before sending a message.');
        return;
      }

      if (!backendAgentId) {
        setError(
          sessionError ??
            'Chat session is not ready for this application and agent.',
        );
        return;
      }

      const resolved = resolveApplicationAgent(
        agents,
        applicationName,
        agentSlug,
      );

      if (!resolved) {
        setError('This agent is not available for the selected application.');
        return;
      }

      const username = user?.name?.trim();
      if (!username) {
        setError('User profile is not loaded. Please sign in again.');
        return;
      }

      const currentConversationId = conversationIdRef.current;
      const messageConversationId = currentConversationId ?? 'pending';
      const pendingMessage = createPendingAssistantMessage(messageConversationId);
      const pendingId = pendingMessage.id;

      setError(null);
      setMessages((prev) => [
        ...prev,
        createUserMessage(trimmed, messageConversationId),
        pendingMessage,
      ]);
      setStreamingAnswer('');
      setIsStreaming(true);
      isStreamingRef.current = true;

      const abort = new AbortController();
      abortRef.current = abort;

      let fullAnswer = '';
      let suggestedQueries: string[] = [];
      let resolvedConversationId = messageConversationId;

      try {
        const chatResult = await streamChat({
          application: resolved.application.id,
          agentId: backendAgentId,
          message: trimmed,
          conversationId: currentConversationId,
          userId: username,
          signal: abort.signal,
          onChunk: (chunk) => {
            fullAnswer += chunk;
            const nextAnswer = fullAnswer.trim();
            setStreamingAnswer(fullAnswer);
            setMessages((messagesPrev) =>
              messagesPrev.map((message) =>
                message.id === pendingId
                  ? { ...message, content: nextAnswer }
                  : message,
              ),
            );
          },
          onConversationId: (nextConversationId) => {
            resolvedConversationId = nextConversationId;
            syncConversationId(nextConversationId);
          },
          onSuggestedQueries: (queries) => {
            suggestedQueries = queries;
          },
        });

        if (!conversationIdRef.current && resolvedConversationId !== 'pending') {
          syncConversationId(resolvedConversationId);
        }

        const answerText = (fullAnswer || chatResult.text).trim();
        const followUps =
          suggestedQueries.length > 0
            ? suggestedQueries
            : chatResult.suggestedQueries;

        if (answerText) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === pendingId
                ? createAssistantMessage(
                    answerText,
                    conversationIdRef.current ?? resolvedConversationId,
                    followUps,
                  )
                : message,
            ),
          );
        } else {
          setMessages((prev) => prev.filter((message) => message.id !== pendingId));
          setError(
            'The assistant responded, but no displayable text was found in the response.',
          );
        }
      } catch (err) {
        setMessages((prev) => prev.filter((message) => message.id !== pendingId));
        if ((err as Error).name !== 'AbortError') {
          const message =
            err instanceof Error ? err.message : 'Failed to get a response';
          setError(message);
        }
      } finally {
        setStreamingAnswer('');
        setIsStreaming(false);
        isStreamingRef.current = false;
        abortRef.current = null;
      }
    },
    [
      agentSlug,
      applicationName,
      agents,
      backendAgentId,
      sessionError,
      syncConversationId,
      user?.name,
    ],
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const resolvedApplication = applicationName
    ? findApplicationById(applications, applicationName)
    : undefined;
  const resolvedAgentAccess = applicationName
    ? findAgentAccess(agents, applicationName, agentSlug)
    : undefined;

  return {
    conversationId,
    isCreatingThread: isLoadingSession,
    threadError: sessionError,
    isThreadReady: Boolean(
      resolvedApplication && resolvedAgentAccess && backendAgentId && conversationId,
    ),
    needsApplication:
      !applicationName ||
      (!isLoadingAgents &&
        Boolean(applicationName) &&
        !resolvedApplication) ||
      (!isLoadingAgents && !resolvedAgentAccess),
    messages,
    streamingAnswer,
    isStreaming,
    error: error ?? sessionError,
    sendMessage,
    cancelStream,
  };
}
