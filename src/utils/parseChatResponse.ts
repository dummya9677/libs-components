import {
  extractTextFromContentBlocks,
  parseLooseObject,
  parseMessagePayload,
} from './parseMessageContent';

export interface ParsedChatResponse {
  conversationId: string | null;
  text: string;
  suggestedQueries: string[];
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

  const parsed = parseMessagePayload(record.response ?? record);
  if (parsed.text || parsed.suggestedQueries.length > 0) {
    return {
      conversationId,
      text: parsed.text,
      suggestedQueries: parsed.suggestedQueries,
    };
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
