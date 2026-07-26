import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useCreateThreadMutation,
  useLazyGetConversationMessagesQuery,
} from '../services/api';
import { streamChat } from '../services/chat/streamChat';
import type { HistoryMessage } from '../types';

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
): HistoryMessage {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
    conversationId,
  };
}

/**
 * Agent chat lifecycle:
 * 1. User selects application → POST create-thread with agent + application → store `threadId`
 * 2. Load existing messages for that thread (if any)
 * 3. On send → POST /chat with agent, application, and thread id (streamed response)
 */
export function useAgentChat(agentId: string, applicationName: string | null) {
  const [createThread] = useCreateThreadMutation();
  const [fetchMessages] = useLazyGetConversationMessagesQuery();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [threadError, setThreadError] = useState<string | null>(null);
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [streamingAnswer, setStreamingAnswer] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;

    abortRef.current?.abort();
    setThreadId(null);
    setIsCreatingThread(false);
    setThreadError(null);
    setMessages([]);
    setStreamingAnswer('');
    setError(null);
    setIsStreaming(false);

    if (!applicationName) {
      return () => {
        cancelled = true;
      };
    }

    setIsCreatingThread(true);

    const initThread = async () => {
      try {
        const result = await createThread({ agentId, applicationName }).unwrap();
        if (cancelled) return;

        setThreadId(result.threadId);

        try {
          const historyPage = await fetchMessages({
            conversationId: result.threadId,
          }).unwrap();
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
              : 'Failed to create a chat thread for this agent';
          setThreadError(message);
        }
      } finally {
        if (!cancelled) {
          setIsCreatingThread(false);
        }
      }
    };

    void initThread();

    return () => {
      cancelled = true;
    };
  }, [agentId, applicationName, createThread, fetchMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      if (!applicationName) {
        setError('Select an application before sending a message.');
        return;
      }

      if (!threadId) {
        setError(
          isCreatingThread
            ? 'Setting up chat session…'
            : threadError ?? 'Chat session is not ready. Please try again.',
        );
        return;
      }

      setError(null);
      setMessages((prev) => [...prev, createUserMessage(trimmed, threadId)]);
      setStreamingAnswer('');
      setIsStreaming(true);

      const abort = new AbortController();
      abortRef.current = abort;

      let fullAnswer = '';

      try {
        await streamChat({
          agentId,
          applicationName,
          threadId,
          content: trimmed,
          signal: abort.signal,
          onChunk: (chunk) => {
            fullAnswer += chunk;
            setStreamingAnswer(fullAnswer);
          },
        });

        if (fullAnswer.trim()) {
          setMessages((prev) => [
            ...prev,
            createAssistantMessage(fullAnswer.trim(), threadId),
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
      isCreatingThread,
      isStreaming,
      threadError,
      threadId,
    ],
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    threadId,
    isCreatingThread,
    threadError,
    isThreadReady: Boolean(threadId),
    needsApplication: !applicationName,
    messages,
    streamingAnswer,
    isStreaming,
    error: error ?? threadError,
    sendMessage,
    cancelStream,
  };
}
