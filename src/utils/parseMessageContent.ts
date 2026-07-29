export interface ParsedMessageContent {
  text: string;
  suggestedQueries: string[];
}

function readQuotedString(
  source: string,
  start: number,
): { value: string; end: number } | null {
  const quote = source[start];
  if (quote !== "'" && quote !== '"') return null;

  let value = '';
  let i = start + 1;

  while (i < source.length) {
    const ch = source[i];

    if (ch === '\\' && i + 1 < source.length) {
      const next = source[i + 1];
      if (next === 'n') value += '\n';
      else if (next === 't') value += '\t';
      else if (next === 'r') value += '\r';
      else value += next;
      i += 2;
      continue;
    }

    if (ch === quote) {
      return { value, end: i + 1 };
    }

    value += ch;
    i += 1;
  }

  return null;
}

function findMatchingBracket(
  source: string,
  openIndex: number,
  open: string,
  close: string,
): number {
  let depth = 0;
  let inString: "'" | '"' | null = null;
  let escaped = false;

  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      inString = ch;
      continue;
    }

    if (ch === open) depth += 1;
    if (ch === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function findKeyIndex(source: string, key: string): number {
  const patterns = [`'${key}'`, `"${key}"`];
  let best = -1;

  for (const pattern of patterns) {
    const index = source.indexOf(pattern);
    if (index !== -1 && (best === -1 || index < best)) {
      best = index;
    }
  }

  return best;
}

function splitTopLevelObjects(arrayBody: string): string[] {
  const items: string[] = [];
  let depth = 0;
  let inString: "'" | '"' | null = null;
  let escaped = false;
  let start = 0;

  for (let i = 0; i < arrayBody.length; i += 1) {
    const ch = arrayBody[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      inString = ch;
      continue;
    }

    if (ch === '{') {
      if (depth === 0) start = i;
      depth += 1;
      continue;
    }

    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        items.push(arrayBody.slice(start, i + 1));
      }
    }
  }

  return items;
}

function readFieldString(block: string, field: string): string | null {
  const keyIndex = findKeyIndex(block, field);
  if (keyIndex === -1) return null;

  const colonIndex = block.indexOf(':', keyIndex);
  if (colonIndex === -1) return null;

  let pos = colonIndex + 1;
  while (pos < block.length && /\s/.test(block[pos] ?? '')) {
    pos += 1;
  }

  if (block[pos] === '{') {
    const nestedKey = findKeyIndex(block.slice(pos), 'text');
    if (nestedKey === -1) return null;
    const absolute = pos + nestedKey;
    const nestedColon = block.indexOf(':', absolute);
    if (nestedColon === -1) return null;
    let nestedPos = nestedColon + 1;
    while (nestedPos < block.length && /\s/.test(block[nestedPos] ?? '')) {
      nestedPos += 1;
    }
    const nested = readQuotedString(block, nestedPos);
    return nested?.value ?? null;
  }

  const quoted = readQuotedString(block, pos);
  return quoted?.value ?? null;
}

function readFieldType(block: string): string | null {
  return readFieldString(block, 'type');
}

function extractContentBlocksFromPythonish(source: string): unknown[] | null {
  const keyIndex = findKeyIndex(source, 'content');
  if (keyIndex === -1) return null;

  const arrayStart = source.indexOf('[', keyIndex);
  if (arrayStart === -1) return null;

  const arrayEnd = findMatchingBracket(source, arrayStart, '[', ']');
  if (arrayEnd === -1) return null;

  const arrayBody = source.slice(arrayStart + 1, arrayEnd);
  const objectStrings = splitTopLevelObjects(arrayBody);
  const blocks: unknown[] = [];

  for (const objectStr of objectStrings) {
    const type = readFieldType(objectStr);
    if (!type) continue;

    if (type === 'text') {
      const text = readFieldString(objectStr, 'text');
      if (text !== null) {
        blocks.push({ type: 'text', text });
      }
      continue;
    }

    if (type === 'thinking') {
      blocks.push({ type: 'thinking' });
      continue;
    }

    if (type === 'suggested_queries') {
      blocks.push({ type: 'suggested_queries', objectStr });
    }
  }

  return blocks.length > 0 ? blocks : null;
}

export function parseLooseObject(value: unknown): Record<string, unknown> | null {
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
    // Fall through to Python-style parsing.
  }

  const contentBlocks = extractContentBlocksFromPythonish(trimmed);
  if (contentBlocks) {
    return { content: contentBlocks };
  }

  return null;
}

export function extractTextFromContentBlocks(content: unknown): ParsedMessageContent {
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
        textParts.push(text.trim());
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
    text: textParts.join('\n\n').trim(),
    suggestedQueries,
  };
}

/**
 * Parse message bodies from chat responses, history records, or plain strings.
 */
export function parseMessagePayload(payload: unknown): ParsedMessageContent {
  const empty: ParsedMessageContent = { text: '', suggestedQueries: [] };

  if (payload === null || payload === undefined) return empty;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return empty;

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return { text: trimmed, suggestedQueries: [] };
    }

    const loose = parseLooseObject(trimmed);
    if (loose?.content) {
      return extractTextFromContentBlocks(loose.content);
    }

    return { text: trimmed, suggestedQueries: [] };
  }

  if (typeof payload === 'object' && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;

    if (record.response !== undefined) {
      return parseMessagePayload(record.response);
    }

    if (Array.isArray(record.content)) {
      const fromBlocks = extractTextFromContentBlocks(record.content);
      if (fromBlocks.text || fromBlocks.suggestedQueries.length > 0) {
        return fromBlocks;
      }
    }

    if (typeof record.content === 'string') {
      return parseMessagePayload(record.content);
    }

    if (typeof record.message === 'string' && record.message.trim()) {
      return { text: record.message.trim(), suggestedQueries: [] };
    }

    if (typeof record.text === 'string' && record.text.trim()) {
      return { text: record.text.trim(), suggestedQueries: [] };
    }
  }

  return empty;
}
