import type { HistoryMessage, MessagesPage } from '../types';
import { parseChatResponse } from './parseChatResponse';
import { parseMessagePayload } from './parseMessageContent';
import { normalizeApiTimestamp, parseApiTimestamp } from './time';

function inferRole(raw: Record<string, unknown>): HistoryMessage['role'] | null {
  const role = raw.role;
  if (
    role === 'user' ||
    role === 'assistant' ||
    role === 'system' ||
    role === 'status' ||
    role === 'progress' ||
    role === 'result'
  ) {
    return role;
  }

  if (raw.response !== undefined || raw.agent_id !== undefined || raw.agent_name) {
    return 'assistant';
  }

  return null;
}

function normalizeHistoryMessage(
  raw: Record<string, unknown>,
  conversationId: string,
): HistoryMessage | null {
  const role = inferRole(raw);
  if (!role) return null;

  const id = raw.id ?? raw.message_id ?? raw.messageId;
  const createdAtRaw =
    raw.createdAt ??
    raw.created_at ??
    raw.timestamp ??
    new Date().toISOString();
  const createdAt = normalizeApiTimestamp(String(createdAtRaw));

  let content = '';
  let actions: HistoryMessage['actions'];
  let sources: HistoryMessage['sources'];
  let toolsUsed: HistoryMessage['toolsUsed'];

  if (role === 'assistant' && (raw.response !== undefined || raw.agent_id !== undefined)) {
    const parsed = parseChatResponse(raw);
    content = parsed.text;
    if (parsed.suggestedQueries.length > 0) {
      actions = parsed.suggestedQueries.map((label) => ({
        label,
        variant: 'link' as const,
      }));
    }
    if (parsed.sources.length > 0) {
      sources = parsed.sources;
    }
    if (parsed.toolsUsed.length > 0) {
      toolsUsed = parsed.toolsUsed;
    }
  } else if (role === 'user' || role === 'assistant' || role === 'system') {
    const parsed = parseMessagePayload(
      raw.content ?? raw.message ?? raw.text ?? raw.response,
    );
    content = parsed.text;
    if (parsed.suggestedQueries.length > 0) {
      actions = parsed.suggestedQueries.map((label) => ({
        label,
        variant: 'link' as const,
      }));
    }
    if (parsed.sources.length > 0) {
      sources = parsed.sources;
    }
    if (parsed.toolsUsed.length > 0) {
      toolsUsed = parsed.toolsUsed;
    }
  } else {
    content =
      typeof raw.content === 'string'
        ? raw.content
        : typeof raw.message === 'string'
          ? raw.message
          : typeof raw.text === 'string'
            ? raw.text
            : '';
  }

  if (!id && !content.trim()) return null;

  return {
    id: String(id ?? `msg-${Math.random().toString(36).slice(2, 9)}`),
    role,
    content: content.trim(),
    createdAt,
    conversationId,
    ...(actions ? { actions } : {}),
    ...(sources ? { sources } : {}),
    ...(toolsUsed ? { toolsUsed } : {}),
    ...(Array.isArray(raw.bullets) ? { bullets: raw.bullets as string[] } : {}),
    ...(typeof raw.followUp === 'string' ? { followUp: raw.followUp } : {}),
  };
}

function sortMessagesChronologically(messages: HistoryMessage[]): HistoryMessage[] {
  return [...messages].sort((a, b) => {
    const aTime = parseApiTimestamp(a.createdAt).getTime();
    const bTime = parseApiTimestamp(b.createdAt).getTime();

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;
    return aTime - bTime;
  });
}

export function normalizeConversationHistory(
  data: unknown,
  conversationId: string,
): MessagesPage {
  const empty: MessagesPage = {
    items: [],
    conversationId,
    page: 1,
    pageSize: 0,
    totalMessages: 0,
    nextPage: null,
    hasMore: false,
  };

  if (!data) return empty;

  let list: unknown[] | null = null;
  let record: Record<string, unknown> = {};

  if (Array.isArray(data)) {
    list = data;
  } else if (typeof data === 'object') {
    record = data as Record<string, unknown>;
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

  const resolvedConversationId =
    typeof record.conversation_id === 'string'
      ? record.conversation_id
      : typeof record.conversationId === 'string'
        ? record.conversationId
        : conversationId;

  const items = sortMessagesChronologically(
    list
      .map((item) =>
        normalizeHistoryMessage(
          item as Record<string, unknown>,
          resolvedConversationId,
        ),
      )
      .filter((item): item is HistoryMessage => {
        if (!item) return false;
        if (item.role === 'user' || item.role === 'assistant' || item.role === 'system') {
          return Boolean(
            item.content?.trim() ||
              item.bullets?.length ||
              item.sources?.length,
          );
        }
        return true;
      }),
  );

  const page =
    typeof record.page === 'number' && Number.isFinite(record.page)
      ? record.page
      : 1;
  const pageSize =
    typeof record.page_size === 'number' && Number.isFinite(record.page_size)
      ? record.page_size
      : items.length;
  const totalMessages =
    typeof record.total_messages === 'number' &&
    Number.isFinite(record.total_messages)
      ? record.total_messages
      : items.length;
  const hasMore = record.has_more === true;

  return {
    items,
    conversationId: resolvedConversationId,
    page,
    pageSize,
    totalMessages,
    nextPage: hasMore ? page + 1 : null,
    hasMore,
  };
}
