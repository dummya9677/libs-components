import { env } from '../../utils/env';

export interface StreamChatOptions {
  content: string;
  agentId?: string;
  threadId?: string;
  signal?: AbortSignal;
  /** Called for each streamed text chunk — use to update UI (setAnswer pattern). */
  onChunk: (chunk: string) => void;
}

function buildChatUrl(): string {
  const base = env.apiBaseUrl.replace(/\/$/, '');
  const path = env.api.agentChatPath.replace(/^\//, '');
  return `${base}/${path}`;
}

function extractTextFromJsonPayload(payload: unknown): string {
  if (typeof payload === 'string') return payload;
  if (!payload || typeof payload !== 'object') return '';

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.delta,
    record.content,
    record.text,
    record.answer,
    record.message,
    record.token,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate) return candidate;
    if (candidate && typeof candidate === 'object') {
      const nested = extractTextFromJsonPayload(candidate);
      if (nested) return nested;
    }
  }

  const assistantMessage = record.assistantMessage;
  if (assistantMessage && typeof assistantMessage === 'object') {
    const content = (assistantMessage as Record<string, unknown>).content;
    if (typeof content === 'string') return content;
  }

  return '';
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
 * POST /chat (or env path) and stream the assistant reply.
 * Supports plain-text streams, SSE (`data:` lines), and JSON fallback.
 */
export async function streamChat({
  content,
  agentId,
  threadId,
  signal,
  onChunk,
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
      content,
      message: content,
      query: content,
      agentId,
      threadId,
      thread_id: threadId,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(detail || `Chat request failed (${response.status})`);
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const data: unknown = await response.json();
    const text = extractTextFromJsonPayload(data);
    if (text) onChunk(text);
    return;
  }

  await readResponseStream(response, onChunk);
}
