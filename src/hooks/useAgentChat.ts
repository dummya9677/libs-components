import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useGetAgentsQuery,
  useLazyGetConversationHistoryQuery,
  useStartConversationMutation,
} from '../services/api';
import { streamChat } from '../services/chat/streamChat';
import type { HistoryMessage } from '../types';
import {
  EMPTY_AGENT_ACCESS_LIST,
  findAgentAccess,
  findApplicationById,
  getApplicationsForDropdown,
  resolveApplicationAgent,
} from '../utils/applicationAgents';
import { useAuth } from './useAuth';

function mergeHistoryMessages(
  existing: HistoryMessage[],
  incoming: HistoryMessage[],
): HistoryMessage[] {
  const seen = new Set(existing.map((message) => message.id));
  const merged = [...existing];

  for (const message of incoming) {
    if (seen.has(message.id)) continue;
    seen.add(message.id);
    merged.push(message);
  }

  return merged.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

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
  sources: HistoryMessage['sources'] = [],
  toolsUsed: string[] = [],
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
    ...(sources.length > 0 ? { sources } : {}),
    ...(toolsUsed.length > 0 ? { toolsUsed } : {}),
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
 * 3. POST /history/conversations/messages (page 1 = most recent messages)
 * 4. POST /chat with application id, agent_id, message, conversation_id, user_id (username)
 */
export function useAgentChat(agentSlug: string, applicationName: string | null) {
  const { user, isAuthenticated } = useAuth();
  const { data: agentsData, isLoading: isLoadingAgents } = useGetAgentsQuery(
    undefined,
    { skip: !isAuthenticated },
  );
  const agents = agentsData ?? EMPTY_AGENT_ACCESS_LIST;
  const [startConversation] = useStartConversationMutation();
  const [fetchHistory] = useLazyGetConversationHistoryQuery();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [backendAgentId, setBackendAgentId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const sessionKeyRef = useRef('');
  const sessionBootstrappedRef = useRef('');
  const bootstrapAttemptRef = useRef(0);
  const isStreamingRef = useRef(false);
  const agentsRef = useRef(agents);
  const startConversationRef = useRef(startConversation);
  const fetchHistoryRef = useRef(fetchHistory);
  const historyRequestRef = useRef<{
    userId: string;
    application: string;
    agentId: string;
  } | null>(null);

  agentsRef.current = agents;
  startConversationRef.current = startConversation;
  fetchHistoryRef.current = fetchHistory;

  const applications = useMemo(
    () => getApplicationsForDropdown(agents, agentSlug),
    [agents, agentSlug],
  );

  const username = user?.name?.trim() ?? '';

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
      sessionBootstrappedRef.current = '';
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
      historyRequestRef.current = null;
      abortRef.current?.abort();
      syncConversationId(null);
      setBackendAgentId(null);
      setSessionError(null);
      setMessages([]);
      setHistoryPage(1);
      setHasMoreHistory(false);
      setIsLoadingOlderMessages(false);
      setStreamingAnswer('');
      setError(null);
      setIsStreaming(false);
      isStreamingRef.current = false;
    }

    const currentAgents = agentsRef.current;
    const currentApplications = getApplicationsForDropdown(
      currentAgents,
      agentSlug,
    );
    const application = findApplicationById(currentApplications, applicationName);
    const agentAccess = findAgentAccess(
      currentAgents,
      applicationName,
      agentSlug,
    );

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

    if (!username) {
      setSessionError(null);
      setBackendAgentId(null);
      setIsLoadingSession(false);
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
        const started = await startConversationRef
          .current({
            userId: username,
            application: agentAccess.application,
            agentId: agentAccess.id,
          })
          .unwrap();

        if (cancelled || attempt !== bootstrapAttemptRef.current) return;

        syncConversationId(started.conversationId);

        try {
          const historyRequest = {
            userId: username,
            application: agentAccess.application,
            agentId: agentAccess.id,
            page: 1,
            pageSize: 10,
          };
          historyRequestRef.current = historyRequest;

          const historyPageResult = await fetchHistoryRef
            .current(historyRequest)
            .unwrap();
          if (!cancelled && attempt === bootstrapAttemptRef.current) {
            if (historyPageResult.conversationId) {
              syncConversationId(historyPageResult.conversationId);
            }
            setHistoryPage(historyPageResult.page);
            setHasMoreHistory(historyPageResult.hasMore);
            setMessages((prev) =>
              prev.length > 0 ? prev : historyPageResult.items,
            );
          }
        } catch {
          if (!cancelled && attempt === bootstrapAttemptRef.current) {
            setMessages((prev) => (prev.length > 0 ? prev : []));
            setHasMoreHistory(false);
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
        if (attempt === bootstrapAttemptRef.current) {
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
    isLoadingAgents,
    syncConversationId,
    username,
  ]);

  const loadOlderMessages = useCallback(async () => {
    if (
      isLoadingOlderMessages ||
      !hasMoreHistory ||
      isStreamingRef.current
    ) {
      return;
    }

    const request = historyRequestRef.current;
    if (!request) return;

    const nextPage = historyPage + 1;
    setIsLoadingOlderMessages(true);

    try {
      const historyPageResult = await fetchHistoryRef
        .current({
          ...request,
          page: nextPage,
        })
        .unwrap();

      if (historyPageResult.conversationId) {
        syncConversationId(historyPageResult.conversationId);
      }

      setHistoryPage(historyPageResult.page);
      setHasMoreHistory(historyPageResult.hasMore);
      setMessages((prev) => mergeHistoryMessages(prev, historyPageResult.items));
    } catch {
      // Keep existing messages if pagination fails.
    } finally {
      setIsLoadingOlderMessages(false);
    }
  }, [hasMoreHistory, historyPage, syncConversationId, isLoadingOlderMessages]);

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
        agentsRef.current,
        applicationName,
        agentSlug,
      );

      if (!resolved) {
        setError('This agent is not available for the selected application.');
        return;
      }

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
      let sources: HistoryMessage['sources'] = [];
      let toolsUsed: string[] = [];
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
            fullAnswer = chunk;
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
          onSources: (nextSources) => {
            sources = nextSources;
          },
          onToolsUsed: (tools) => {
            toolsUsed = tools;
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
        const messageSources =
          (sources?.length ?? 0) > 0 ? sources : chatResult.sources;
        const messageTools =
          toolsUsed.length > 0 ? toolsUsed : chatResult.toolsUsed;

        if (answerText || (messageSources?.length ?? 0) > 0) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === pendingId
                ? createAssistantMessage(
                    answerText,
                    conversationIdRef.current ?? resolvedConversationId,
                    followUps,
                    messageSources ?? [],
                    messageTools,
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
      backendAgentId,
      sessionError,
      syncConversationId,
      username,
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
    hasMoreHistory,
    isLoadingOlderMessages,
    loadOlderMessages,
    streamingAnswer,
    isStreaming,
    error: error ?? sessionError,
    sendMessage,
    cancelStream,
  };
}
