import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { useGetConversationMessagesQuery } from '../services/api';
import type { HistoryMessage } from '../types';

const DEFAULT_LIMIT = 8;

export interface UseInfiniteChatMessagesResult {
  messages: HistoryMessage[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingOlder: boolean;
  hasMore: boolean;
  error: unknown;
  /** Call when the user scrolls near the top to load older messages. */
  loadOlder: () => void;
  /** Attach to the scrollable chat container. */
  scrollRef: RefObject<HTMLDivElement>;
  /** Attach above the message list (intersection sentinel). */
  topSentinelRef: RefObject<HTMLDivElement>;
}

/**
 * Server-side infinite scroll for conversation messages via RTK Query.
 * Scroll up → loads older pages; scroll position is preserved on prepend.
 */
export function useInfiniteChatMessages(
  conversationId: string,
  limit = DEFAULT_LIMIT,
): UseInfiniteChatMessagesResult {
  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const pendingScrollRestore = useRef<{ height: number; top: number } | null>(
    null,
  );
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCursor(undefined);
  }, [conversationId]);

  const { data, isLoading, isFetching, isError, error } =
    useGetConversationMessagesQuery(
      {
        conversationId,
        cursor,
        limit,
      },
      { skip: !conversationId },
    );

  const messages = data?.items ?? [];
  const hasMore = Boolean(data?.hasMore);
  const nextCursor = data?.nextCursor ?? null;

  // After older messages prepend, restore scroll so the viewport doesn't jump
  useEffect(() => {
    const el = scrollRef.current;
    const pending = pendingScrollRestore.current;
    if (!el || !pending) return;

    const delta = el.scrollHeight - pending.height;
    el.scrollTop = pending.top + delta;
    pendingScrollRestore.current = null;
  }, [messages.length]);

  // First load: pin to bottom (newest)
  const didInitialScroll = useRef(false);
  useEffect(() => {
    didInitialScroll.current = false;
  }, [conversationId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isLoading || didInitialScroll.current || messages.length === 0) {
      return;
    }
    el.scrollTop = el.scrollHeight;
    didInitialScroll.current = true;
  }, [isLoading, messages.length]);

  const loadOlder = useCallback(() => {
    if (!hasMore || isFetching || !nextCursor) return;

    const el = scrollRef.current;
    if (el) {
      pendingScrollRestore.current = {
        height: el.scrollHeight,
        top: el.scrollTop,
      };
    }

    setCursor(nextCursor);
  }, [hasMore, isFetching, nextCursor]);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = topSentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadOlder();
        }
      },
      { root, rootMargin: '80px 0px 0px 0px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadOlder, messages.length]);

  const isFetchingOlder = isFetching && cursor !== undefined;

  return {
    messages,
    isLoading,
    isFetching,
    isFetchingOlder,
    hasMore,
    error: isError ? error : undefined,
    loadOlder,
    scrollRef,
    topSentinelRef,
  };
}
