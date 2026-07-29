import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useGetApplicationsQuery,
  useLazyGetConversationHistoryQuery,
} from '../services/api';
import { streamChat } from '../services/chat/streamChat';
import type { HistoryMessage } from '../types';
import {
  findApplicationById,
  findAgentInApplication,
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
 * 1. GET /applications → resolve agent + optional conversation_id for (app, agent)
 * 2. GET /history/conversations/{conversation_id} when an id exists (empty on 404)
 * 3. POST /chat with application, agent_id, message, conversation_id, user_id
 * 4. Follow-up messages reuse the same conversation_id returned from /chat
 */
export function useAgentChat(agentId: string, applicationName: string | null) {
  const { user } = useAuth();
  const { data: applications = [], isLoading: isLoadingApplications } =
    useGetApplicationsQuery();
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

    const backendAgent = findAgentInApplication(application, agentId);

    if (!backendAgent) {
      setSessionError(
        'This agent is not available for the selected application.',
      );
      setBackendAgentId(null);
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    sessionBootstrappedRef.current = sessionKey;
    setBackendAgentId(backendAgent.id);

    const initialConversationId = backendAgent.conversationId ?? null;
    syncConversationId(initialConversationId);

    if (!initialConversationId) {
      setIsLoadingSession(false);
      return () => {
        cancelled = true;
      };
    }

    setIsLoadingSession(true);

    const loadHistory = async () => {
      try {
        const historyPage = await fetchHistory(initialConversationId).unwrap();
        if (!cancelled) {
          setMessages(historyPage.items);
        }
      } catch {
        if (!cancelled) {
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSession(false);
        }
      }
    };

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [
    agentId,
    applicationName,
    applications,
    fetchHistory,
    isLoadingApplications,
    syncConversationId,
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
          application: resolved.application.name,
          agentId: backendAgentId,
          message: trimmed,
          conversationId: currentConversationId,
          userId: user?.id ?? 'yesh',
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
      user?.id,
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
    isThreadReady: Boolean(resolvedApplication && backendAgentId),
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
