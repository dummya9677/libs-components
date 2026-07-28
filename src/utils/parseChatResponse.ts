export interface ParsedChatResponse {
  conversationId: string | null;
  text: string;
  suggestedQueries: string[];
}

function parseLooseObject(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Fall through to Python-style dict parsing.
  }

  try {
    const jsonish = trimmed
      .replace(/\bNone\b/g, 'null')
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/'/g, '"');
    const parsed: unknown = JSON.parse(jsonish);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }

  return null;
}

function extractTextFromContentBlocks(content: unknown): {
  text: string;
  suggestedQueries: string[];
} {
  if (!Array.isArray(content)) {
    return { text: '', suggestedQueries: [] };
  }

  const textParts: string[] = [];
  const suggestedQueries: string[] = [];

  for (const block of content) {
    if (!block || typeof block !== 'object') continue;

    const record = block as Record<string, unknown>;
    const type = String(record.type ?? '');

    if (type === 'text') {
      const text = record.text;
      if (typeof text === 'string' && text.trim()) {
        textParts.push(text);
      }
      continue;
    }

    if (type === 'thinking') {
      continue;
    }

    if (type === 'suggested_queries') {
      const queries = record.suggested_queries ?? record.suggestedQueries;
      if (!Array.isArray(queries)) continue;

      for (const query of queries) {
        if (typeof query === 'string' && query.trim()) {
          suggestedQueries.push(query.trim());
          continue;
        }

        if (query && typeof query === 'object') {
          const row = query as Record<string, unknown>;
          const label = row.query ?? row.text ?? row.label;
          if (typeof label === 'string' && label.trim()) {
            suggestedQueries.push(label.trim());
          }
        }
      }
    }
  }

  return {
    text: textParts.join('').trim(),
    suggestedQueries,
  };
}

/**
 * Parse POST /chat JSON payloads from the backend.
 *
 * Expected shape:
 * {
 *   conversation_id: string,
 *   agent_id: string,
 *   agent_name: string,
 *   response: "{ content: [...], role: 'assistant', ... }" | object,
 *   thread_id: null
 * }
 */
export function parseChatResponse(payload: unknown): ParsedChatResponse {
  const empty: ParsedChatResponse = {
    conversationId: null,
    text: '',
    suggestedQueries: [],
  };

  if (!payload || typeof payload !== 'object') return empty;

  const record = payload as Record<string, unknown>;
  const conversationId =
    typeof record.conversation_id === 'string'
      ? record.conversation_id
      : typeof record.conversationId === 'string'
        ? record.conversationId
        : typeof record.thread_id === 'string'
          ? record.thread_id
          : typeof record.threadId === 'string'
            ? record.threadId
            : null;

  const inner =
    parseLooseObject(record.response) ??
    (Array.isArray(record.content) ? record : null);

  if (inner) {
    const { text, suggestedQueries } = extractTextFromContentBlocks(inner.content);

    if (text || suggestedQueries.length > 0) {
      return { conversationId, text, suggestedQueries };
    }
  }

  const fallbackText =
    typeof record.message === 'string'
      ? record.message
      : typeof record.answer === 'string'
        ? record.answer
        : typeof record.response === 'string' &&
            !record.response.trim().startsWith('{') &&
            !record.response.trim().startsWith('[')
          ? record.response
          : '';

  return {
    conversationId,
    text: fallbackText.trim(),
    suggestedQueries: [],
  };
}
