import type { MessageSource } from '../types';

export type { MessageSource };

export interface ParsedMessageContent {
  text: string;
  suggestedQueries: string[];
  sources: MessageSource[];
  toolsUsed: string[];
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

function findTopLevelKeyIndex(source: string, key: string): number {
  const patterns = [`'${key}'`, `"${key}"`];
  let depth = 0;
  let inString: "'" | '"' | null = null;
  let escaped = false;

  for (let i = 0; i < source.length; i += 1) {
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

    if (ch === '{' || ch === '[') depth += 1;
    if (ch === '}' || ch === ']') depth -= 1;

    if (depth === 1) {
      for (const pattern of patterns) {
        if (source.startsWith(pattern, i)) {
          return i;
        }
      }
    }

    if (ch === "'" || ch === '"') {
      inString = ch;
      continue;
    }
  }

  return -1;
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

function readTopLevelFieldString(block: string, field: string): string | null {
  const keyIndex = findTopLevelKeyIndex(block, field);
  if (keyIndex === -1) return null;

  const colonIndex = block.indexOf(':', keyIndex);
  if (colonIndex === -1) return null;

  let pos = colonIndex + 1;
  while (pos < block.length && /\s/.test(block[pos] ?? '')) {
    pos += 1;
  }

  if (block[pos] === '{') {
    const nestedKey = findTopLevelKeyIndex(block.slice(pos), 'text');
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
  return readTopLevelFieldString(block, 'type');
}

function parseSuggestedQueriesFromPythonBlock(objectStr: string): string[] {
  const keyIndex = findTopLevelKeyIndex(objectStr, 'suggested_queries');
  if (keyIndex === -1) return [];

  const colonIndex = objectStr.indexOf(':', keyIndex);
  if (colonIndex === -1) return [];

  const arrayStart = objectStr.indexOf('[', colonIndex);
  if (arrayStart === -1) return [];

  const arrayEnd = findMatchingBracket(objectStr, arrayStart, '[', ']');
  if (arrayEnd === -1) return [];

  const arrayBody = objectStr.slice(arrayStart + 1, arrayEnd);
  const objectStrings = splitTopLevelObjects(arrayBody);
  const queries: string[] = [];

  for (const itemStr of objectStrings) {
    const query =
      readTopLevelFieldString(itemStr, 'query') ??
      readTopLevelFieldString(itemStr, 'text') ??
      readTopLevelFieldString(itemStr, 'label');
    if (query?.trim()) {
      queries.push(query.trim());
    }
  }

  return queries;
}

function extractSourcesFromAnnotations(value: unknown): MessageSource[] {
  if (!Array.isArray(value)) return [];

  const sources: MessageSource[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const title = record.doc_title ?? record.docTitle ?? record.title;
    if (typeof title !== 'string' || !title.trim()) continue;

    const url =
      typeof record.url === 'string'
        ? record.url
        : typeof record.URL === 'string'
          ? record.URL
          : undefined;

    sources.push({
      title: title.trim(),
      ...(url ? { url } : {}),
    });
  }

  return sources;
}

function extractSourcesFromToolResult(block: Record<string, unknown>): MessageSource[] {
  const toolResult = block.tool_result ?? block.toolResult;
  if (!toolResult || typeof toolResult !== 'object') return [];

  const content = (toolResult as Record<string, unknown>).content;
  if (!Array.isArray(content)) return [];

  const sources: MessageSource[] = [];

  for (const entry of content) {
    if (!entry || typeof entry !== 'object') continue;
    const record = entry as Record<string, unknown>;
    const json = record.json;
    if (!json || typeof json !== 'object') continue;

    const searchResults = (json as Record<string, unknown>).search_results;
    if (!Array.isArray(searchResults)) continue;

    for (const result of searchResults) {
      if (!result || typeof result !== 'object') continue;
      const row = result as Record<string, unknown>;
      const title = row.doc_title ?? row.docTitle ?? row.title;
      if (typeof title !== 'string' || !title.trim()) continue;

      let url: string | undefined;
      const columns = row.columns;
      if (columns && typeof columns === 'object') {
        const urlValue =
          (columns as Record<string, unknown>).URL ??
          (columns as Record<string, unknown>).url;
        if (typeof urlValue === 'string' && urlValue.trim()) {
          url = urlValue.trim();
        }
      }

      sources.push({
        title: title.trim(),
        ...(url ? { url } : {}),
      });
    }
  }

  return sources;
}

function extractToolNameFromBlock(block: Record<string, unknown>): string | null {
  const toolUse = block.tool_use ?? block.toolUse;
  if (!toolUse || typeof toolUse !== 'object') return null;

  const name = (toolUse as Record<string, unknown>).name;
  return typeof name === 'string' && name.trim() ? name.trim() : null;
}

function extractSourcesFromTextSection(text: string): {
  text: string;
  sources: MessageSource[];
} {
  const sourcesMatch = text.match(/\nSources:\s*\n([\s\S]*)$/i);
  if (!sourcesMatch || sourcesMatch.index === undefined) {
    return { text, sources: [] };
  }

  const sourcesSection = sourcesMatch[1] ?? '';
  const mainText = text.slice(0, sourcesMatch.index).trim();
  const sources: MessageSource[] = [];
  const linePattern =
    /^-\s*\[([^\]]+)\]\s*(.+?)(?:\s*-\s*(https?:\/\/\S+))?\s*$/gm;

  let match: RegExpExecArray | null;
  while ((match = linePattern.exec(sourcesSection)) !== null) {
    sources.push({
      label: match[1]?.trim(),
      title: match[2]?.trim() ?? '',
      ...(match[3] ? { url: match[3].trim() } : {}),
    });
  }

  return { text: mainText, sources };
}

function dedupeSources(sources: MessageSource[]): MessageSource[] {
  const seen = new Set<string>();
  const result: MessageSource[] = [];

  for (const source of sources) {
    const key = `${source.url ?? ''}|${source.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(source);
  }

  return result;
}

function extractContentBlocksFromPythonish(source: string): unknown[] | null {
  const keyIndex = findTopLevelKeyIndex(source, 'content');
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
      const text = readTopLevelFieldString(objectStr, 'text');
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
      blocks.push({
        type: 'suggested_queries',
        suggested_queries: parseSuggestedQueriesFromPythonBlock(objectStr),
      });
      continue;
    }

    if (type === 'tool_use') {
      const name = readTopLevelFieldString(objectStr, 'name');
      blocks.push({
        type: 'tool_use',
        tool_use: {
          name:
            name ??
            (() => {
              const nestedKey = objectStr.indexOf("'tool_use'");
              if (nestedKey === -1) return undefined;
              const nameKey = objectStr.indexOf("'name'", nestedKey);
              if (nameKey === -1) return undefined;
              const colon = objectStr.indexOf(':', nameKey);
              if (colon === -1) return undefined;
              let pos = colon + 1;
              while (pos < objectStr.length && /\s/.test(objectStr[pos] ?? '')) {
                pos += 1;
              }
              return readQuotedString(objectStr, pos)?.value;
            })(),
        },
      });
      continue;
    }

    if (type === 'tool_result') {
      blocks.push({ type: 'tool_result', objectStr });
    }
  }

  return blocks.length > 0 ? blocks : null;
}

function createEmptyParsedContent(): ParsedMessageContent {
  return { text: '', suggestedQueries: [], sources: [], toolsUsed: [] };
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
    return createEmptyParsedContent();
  }

  const textParts: string[] = [];
  const suggestedQueries: string[] = [];
  const sources: MessageSource[] = [];
  const toolsUsed: string[] = [];

  for (const block of content) {
    if (!block || typeof block !== 'object') continue;

    const record = block as Record<string, unknown>;
    const type = String(record.type ?? '');

    if (type === 'text') {
      const text = record.text;
      if (typeof text === 'string' && text.trim()) {
        textParts.push(text.trim());
      }

      sources.push(...extractSourcesFromAnnotations(record.annotations));
      continue;
    }

    if (type === 'thinking') {
      continue;
    }

    if (type === 'tool_use') {
      const toolName = extractToolNameFromBlock(record);
      if (toolName) {
        toolsUsed.push(toolName);
      }
      continue;
    }

    if (type === 'tool_result') {
      sources.push(...extractSourcesFromToolResult(record));
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

  const joinedText = textParts.join('\n\n').trim();
  const { text: textWithoutSources, sources: textSources } =
    extractSourcesFromTextSection(joinedText);

  return {
    text: textWithoutSources,
    suggestedQueries,
    sources: dedupeSources([...sources, ...textSources]),
    toolsUsed: [...new Set(toolsUsed)],
  };
}

/**
 * Parse message bodies from chat responses, history records, or plain strings.
 */
export function parseMessagePayload(payload: unknown): ParsedMessageContent {
  const empty = createEmptyParsedContent();

  if (payload === null || payload === undefined) return empty;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return empty;

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return { ...empty, text: trimmed };
    }

    const loose = parseLooseObject(trimmed);
    if (loose?.content) {
      return extractTextFromContentBlocks(loose.content);
    }

    return { ...empty, text: trimmed };
  }

  if (typeof payload === 'object' && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;

    if (record.response !== undefined) {
      return parseMessagePayload(record.response);
    }

    if (Array.isArray(record.content)) {
      const fromBlocks = extractTextFromContentBlocks(record.content);
      if (
        fromBlocks.text ||
        fromBlocks.suggestedQueries.length > 0 ||
        fromBlocks.sources.length > 0 ||
        fromBlocks.toolsUsed.length > 0
      ) {
        return fromBlocks;
      }
    }

    if (typeof record.content === 'string') {
      return parseMessagePayload(record.content);
    }

    if (typeof record.message === 'string' && record.message.trim()) {
      return { ...empty, text: record.message.trim() };
    }

    if (typeof record.text === 'string' && record.text.trim()) {
      return { ...empty, text: record.text.trim() };
    }
  }

  return empty;
}
