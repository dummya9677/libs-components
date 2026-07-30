import { env } from '../../utils/env';
import type { MessageSource } from '../../types';
import {
  parseChatResponse,
  type ParsedChatResponse,
} from '../../utils/parseChatResponse';

export type { ParsedChatResponse };

export interface StreamChatOptions {
  application: string;
  agentId: string;
  message: string;
  conversationId?: string | null;
  userId: string;
  signal?: AbortSignal;
  /** Called for each streamed text chunk — use to update UI (setAnswer pattern). */
  onChunk: (chunk: string) => void;
  /** Called when the API returns a conversation id (new or existing). */
  onConversationId?: (conversationId: string) => void;
  /** Called when the API returns suggested follow-up queries. */
  onSuggestedQueries?: (queries: string[]) => void;
  /** Called when the API returns source citations. */
  onSources?: (sources: MessageSource[]) => void;
  /** Called when the API reports tools used in the response. */
  onToolsUsed?: (tools: string[]) => void;
}

function buildChatUrl(): string {
  const base = env.apiBaseUrl.replace(/\/$/, '');
  const path = env.api.agentChatPath.replace(/^\//, '');
  return `${base}/${path}`;
}

function emitParsedResponse(
  parsed: ParsedChatResponse,
  onChunk: (chunk: string) => void,
  onConversationId?: (conversationId: string) => void,
  onSuggestedQueries?: (queries: string[]) => void,
  onSources?: (sources: MessageSource[]) => void,
  onToolsUsed?: (tools: string[]) => void,
): ParsedChatResponse {
  if (parsed.conversationId) {
    onConversationId?.(parsed.conversationId);
  }

  if (parsed.text) {
    onChunk(parsed.text);
  }

  if (parsed.suggestedQueries.length > 0) {
    onSuggestedQueries?.(parsed.suggestedQueries);
  }

  if (parsed.sources.length > 0) {
    onSources?.(parsed.sources);
  }

  if (parsed.toolsUsed.length > 0) {
    onToolsUsed?.(parsed.toolsUsed);
  }

  return parsed;
}

function tryParseChatBody(raw: string): ParsedChatResponse | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const json: unknown = JSON.parse(trimmed);
      const parsed = parseChatResponse(json);
      if (
        parsed.text ||
        parsed.conversationId ||
        parsed.suggestedQueries.length > 0 ||
        parsed.sources.length > 0 ||
        parsed.toolsUsed.length > 0
      ) {
        return parsed;
      }
    } catch {
      // Fall through to python-style string parsing.
    }
  }

  const parsed = parseChatResponse(trimmed);
  if (
    parsed.text ||
    parsed.conversationId ||
    parsed.suggestedQueries.length > 0 ||
    parsed.sources.length > 0 ||
    parsed.toolsUsed.length > 0
  ) {
    return parsed;
  }

  return null;
}

async function readFullBody(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return '';

  const decoder = new TextDecoder();
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
  }

  accumulated += decoder.decode();
  return accumulated;
}

async function readResponseStream(
  response: Response,
  onChunk: (chunk: string) => void,
  onConversationId?: (conversationId: string) => void,
  onSuggestedQueries?: (queries: string[]) => void,
  onSources?: (sources: MessageSource[]) => void,
  onToolsUsed?: (tools: string[]) => void,
): Promise<ParsedChatResponse> {
  const contentType = response.headers.get('content-type') ?? '';
  const isSse = contentType.includes('text/event-stream');

  if (!isSse) {
    const body = await readFullBody(response);
    const parsed = tryParseChatBody(body);

    if (parsed) {
      return emitParsedResponse(
        parsed,
        onChunk,
        onConversationId,
        onSuggestedQueries,
        onSources,
        onToolsUsed,
      );
    }

    if (body.trim()) {
      onChunk(body.trim());
    }

    return {
      conversationId: null,
      text: body.trim(),
      suggestedQueries: [],
      sources: [],
      toolsUsed: [],
    };
  }

  const reader = response.body?.getReader();
  if (!reader) {
    return {
      conversationId: null,
      text: '',
      suggestedQueries: [],
      sources: [],
      toolsUsed: [],
    };
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let streamedText = '';
  let lastParsed: ParsedChatResponse = {
    conversationId: null,
    text: '',
    suggestedQueries: [],
    sources: [],
    toolsUsed: [],
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line.startsWith('data:')) continue;

      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;

      try {
        const parsed: unknown = JSON.parse(payload);
        lastParsed = emitParsedResponse(
          parseChatResponse(parsed),
          onChunk,
          onConversationId,
          onSuggestedQueries,
          onSources,
          onToolsUsed,
        );
        streamedText = lastParsed.text || streamedText;
      } catch {
        const parsed = tryParseChatBody(payload);
        if (parsed) {
          lastParsed = emitParsedResponse(
            parsed,
            onChunk,
            onConversationId,
            onSuggestedQueries,
            onSources,
            onToolsUsed,
          );
          streamedText = lastParsed.text || streamedText;
        } else if (payload) {
          streamedText += payload;
          onChunk(payload);
        }
      }
    }
  }

  const trailing = buffer.trim();
  if (trailing.startsWith('data:')) {
    const payload = trailing.slice(5).trim();
    if (payload && payload !== '[DONE]') {
      try {
        const parsed: unknown = JSON.parse(payload);
        lastParsed = emitParsedResponse(
          parseChatResponse(parsed),
          onChunk,
          onConversationId,
          onSuggestedQueries,
          onSources,
          onToolsUsed,
        );
        streamedText = lastParsed.text || streamedText;
      } catch {
        const parsed = tryParseChatBody(payload);
        if (parsed) {
          lastParsed = emitParsedResponse(
            parsed,
            onChunk,
            onConversationId,
            onSuggestedQueries,
            onSources,
            onToolsUsed,
          );
          streamedText = lastParsed.text || streamedText;
        }
      }
    }
  } else if (trailing) {
    const parsed = tryParseChatBody(trailing);
    if (parsed) {
      lastParsed = emitParsedResponse(
        parsed,
        onChunk,
        onConversationId,
        onSuggestedQueries,
        onSources,
        onToolsUsed,
      );
      streamedText = lastParsed.text || streamedText;
    }
  }

  if (streamedText) {
    return {
      ...lastParsed,
      text: streamedText,
    };
  }

  return lastParsed;
}

/**
 * POST /chat and stream the assistant reply.
 * Supports plain-text streams, SSE (`data:` lines), and JSON fallback.
 */
export async function streamChat({
  application,
  agentId,
  message,
  conversationId = null,
  userId,
  signal,
  onChunk,
  onConversationId,
  onSuggestedQueries,
  onSources,
  onToolsUsed,
}: StreamChatOptions): Promise<ParsedChatResponse> {
  const response = await fetch(buildChatUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream, text/plain, application/json',
    },
    credentials: 'include',
    signal,
    body: JSON.stringify({
      application,
      agent_id: agentId,
      message,
      conversation_id: conversationId,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(detail || `Chat request failed (${response.status})`);
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json') || contentType.includes('text/json')) {
    const data: unknown = await response.json();
    return emitParsedResponse(
      parseChatResponse(data),
      onChunk,
      onConversationId,
      onSuggestedQueries,
      onSources,
      onToolsUsed,
    );
  }

  return readResponseStream(
    response,
    onChunk,
    onConversationId,
    onSuggestedQueries,
    onSources,
    onToolsUsed,
  );
}
