import { env } from '../../utils/env';
import { parseChatResponse } from '../../utils/parseChatResponse';

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
}

function buildChatUrl(): string {
  const base = env.apiBaseUrl.replace(/\/$/, '');
  const path = env.api.agentChatPath.replace(/^\//, '');
  return `${base}/${path}`;
}

function extractTextFromJsonPayload(payload: unknown): string {
  return parseChatResponse(payload).text;
}

async function readResponseStream(
  response: Response,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  const contentType = response.headers.get('content-type') ?? '';
  const isSse = contentType.includes('text/event-stream');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    if (!isSse) {
      if (text) onChunk(text);
      continue;
    }

    buffer += text;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line.startsWith('data:')) continue;

      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;

      try {
        const parsed: unknown = JSON.parse(payload);
        const piece = extractTextFromJsonPayload(parsed);
        if (piece) onChunk(piece);
      } catch {
        onChunk(payload);
      }
    }
  }

  const trailing = buffer.trim();
  if (isSse && trailing.startsWith('data:')) {
    const payload = trailing.slice(5).trim();
    if (payload && payload !== '[DONE]') {
      try {
        const parsed: unknown = JSON.parse(payload);
        const piece = extractTextFromJsonPayload(parsed);
        if (piece) onChunk(piece);
      } catch {
        onChunk(payload);
      }
    }
  }
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
}: StreamChatOptions): Promise<void> {
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

  if (contentType.includes('application/json')) {
    const data: unknown = await response.json();
    const parsed = parseChatResponse(data);

    if (parsed.conversationId) {
      onConversationId?.(parsed.conversationId);
    }

    if (parsed.text) {
      onChunk(parsed.text);
    }

    if (parsed.suggestedQueries.length > 0) {
      onSuggestedQueries?.(parsed.suggestedQueries);
    }

    return;
  }

  await readResponseStream(response, onChunk);
}
