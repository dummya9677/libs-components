import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useGetApplicationsQuery,
  useLazyGetConversationHistoryQuery,
  useStartConversationMutation,
} from '../services/api';
import { streamChat } from '../services/chat/streamChat';
import type { HistoryMessage } from '../types';
import {
  findApplicationById,
  findAgentForFrontend,
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

function buildSessionKey(applicationName: string | null, agentId: string): string {
  return `${applicationName ?? ''}:${agentId}`;
}

/**
 * Agent chat lifecycle:
 * 1. GET /applications → resolve application id
 * 2. POST /history/conversations/start → conversation_id for (username, app, agent)
 * 3. GET /history/conversations/{conversation_id} (empty on 404)
 * 4. POST /chat with application id, agent_id, message, conversation_id, user_id (username)
 */
export function useAgentChat(agentId: string, applicationName: string | null) {
  const { user } = useAuth();
  const { data: applications = [], isLoading: isLoadingApplications } =
    useGetApplicationsQuery();
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

  const syncConversationId = useCallback((nextConversationId: string | null) => {
    conversationIdRef.current = nextConversationId;
    setConversationId(nextConversationId);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sessionKey = buildSessionKey(applicationName, agentId);
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
    }

    if (!applicationName) {
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    if (isLoadingApplications) {
      setIsLoadingSession(true);
      return () => {
        cancelled = true;
      };
    }

    if (sessionBootstrappedRef.current === sessionKey) {
      return () => {
        cancelled = true;
      };
    }

    const application = findApplicationById(applications, applicationName);

    if (!application) {
      setSessionError(null);
      setBackendAgentId(null);
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    const backendAgent = findAgentForFrontend(agentId);

    if (!backendAgent) {
      setSessionError('This agent is not available.');
      setBackendAgentId(null);
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    const username = user?.name?.trim();
    if (!username) {
      setSessionError('User profile is not loaded. Please sign in again.');
      setBackendAgentId(null);
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    sessionBootstrappedRef.current = sessionKey;
    setBackendAgentId(backendAgent.id);
    setIsLoadingSession(true);
    setSessionError(null);

    const bootstrapSession = async () => {
      try {
        const started = await startConversation({
          userId: username,
          application: application.id,
          agentId: backendAgent.id,
        }).unwrap();

        if (cancelled) return;

        syncConversationId(started.conversationId);

        try {
          const historyPage = await fetchHistory(started.conversationId).unwrap();
          if (!cancelled) {
            setMessages(historyPage.items);
          }
        } catch {
          if (!cancelled) {
            setMessages([]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'Failed to start a conversation for this application and agent.';
          setSessionError(message);
          syncConversationId(null);
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSession(false);
        }
      }
    };

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [
    agentId,
    applicationName,
    applications,
    fetchHistory,
    isLoadingApplications,
    startConversation,
    syncConversationId,
    user?.name,
  ]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

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
        applications,
        applicationName,
        agentId,
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

      setError(null);
      setMessages((prev) => [
        ...prev,
        createUserMessage(trimmed, messageConversationId),
      ]);
      setStreamingAnswer('');
      setIsStreaming(true);

      const abort = new AbortController();
      abortRef.current = abort;

      let fullAnswer = '';
      let suggestedQueries: string[] = [];
      let resolvedConversationId = messageConversationId;

      try {
        await streamChat({
          application: resolved.application.id,
          agentId: backendAgentId,
          message: trimmed,
          conversationId: currentConversationId,
          userId: username,
          signal: abort.signal,
          onChunk: (chunk) => {
            fullAnswer += chunk;
            setStreamingAnswer(fullAnswer);
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

        if (fullAnswer.trim()) {
          setMessages((prev) => [
            ...prev,
            createAssistantMessage(
              fullAnswer.trim(),
              conversationIdRef.current ?? resolvedConversationId,
              suggestedQueries,
            ),
          ]);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          const message =
            err instanceof Error ? err.message : 'Failed to get a response';
          setError(message);
        }
      } finally {
        setStreamingAnswer('');
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [
      agentId,
      applicationName,
      applications,
      backendAgentId,
      isStreaming,
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

  return {
    conversationId,
    isCreatingThread: isLoadingSession || isLoadingApplications,
    threadError: sessionError,
    isThreadReady: Boolean(resolvedApplication && backendAgentId && conversationId),
    needsApplication:
      !applicationName ||
      (!isLoadingApplications &&
        Boolean(applicationName) &&
        !resolvedApplication),
    messages,
    streamingAnswer,
    isStreaming,
    error: error ?? sessionError,
    sendMessage,
    cancelStream,
  };
}
