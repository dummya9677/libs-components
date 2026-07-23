import { useCallback, useEffect, useRef, useState } from 'react';
import { useCreateThreadMutation } from '../services/api';
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
 * 1. On agent select → POST create-thread → store `threadId`
 * 2. On Analyze/send → POST /chat with the same `threadId` (streamed response)
 */
export function useAgentChat(agentId: string) {
  const [createThread] = useCreateThreadMutation();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState(true);
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
    setIsCreatingThread(true);
    setThreadError(null);
    setMessages([]);
    setStreamingAnswer('');
    setError(null);
    setIsStreaming(false);

    const initThread = async () => {
      try {
        const result = await createThread({ agentId }).unwrap();
        if (!cancelled) {
          setThreadId(result.threadId);
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
  }, [agentId, createThread]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

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
    [agentId, isCreatingThread, isStreaming, threadError, threadId],
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    threadId,
    isCreatingThread,
    threadError,
    isThreadReady: Boolean(threadId),
    messages,
    streamingAnswer,
    isStreaming,
    error: error ?? threadError,
    sendMessage,
    cancelStream,
  };
}
