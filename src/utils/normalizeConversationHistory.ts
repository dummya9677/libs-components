import type { HistoryMessage, MessagesPage } from '../types';

function normalizeHistoryMessage(
  raw: Record<string, unknown>,
  conversationId: string,
): HistoryMessage | null {
  const role = raw.role;
  if (
    role !== 'user' &&
    role !== 'assistant' &&
    role !== 'system' &&
    role !== 'status' &&
    role !== 'progress' &&
    role !== 'result'
  ) {
    return null;
  }

  const id = raw.id ?? raw.message_id ?? raw.messageId;
  const createdAt =
    raw.createdAt ?? raw.created_at ?? raw.timestamp ?? new Date().toISOString();
  const content =
    typeof raw.content === 'string'
      ? raw.content
      : typeof raw.message === 'string'
        ? raw.message
        : typeof raw.text === 'string'
          ? raw.text
          : '';

  if (!id && !content) return null;

  return {
    id: String(id ?? `msg-${Math.random().toString(36).slice(2, 9)}`),
    role,
    content,
    createdAt: String(createdAt),
    conversationId,
  };
}

export function normalizeConversationHistory(
  data: unknown,
  conversationId: string,
): MessagesPage {
  const empty: MessagesPage = {
    items: [],
    nextCursor: null,
    hasMore: false,
  };

  if (!data) return empty;

  let list: unknown[] | null = null;

  if (Array.isArray(data)) {
    list = data;
  } else if (typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const candidate =
      record.messages ??
      record.items ??
      record.data ??
      record.results ??
      record.history;

    if (Array.isArray(candidate)) {
      list = candidate;
    }
  }

  if (!list) return empty;

  const items = list
    .map((item) =>
      normalizeHistoryMessage(item as Record<string, unknown>, conversationId),
    )
    .filter((item): item is HistoryMessage => item !== null);

  return {
    items,
    nextCursor: null,
    hasMore: false,
  };
}
