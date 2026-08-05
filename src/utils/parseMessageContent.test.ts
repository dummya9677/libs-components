import { describe, expect, it } from 'vitest';
import { parseChatResponse } from './parseChatResponse';
import { normalizeConversationHistory } from './normalizeConversationHistory';
import { parseMessagePayload } from './parseMessageContent';

describe('parseChatResponse', () => {
  it('extracts assistant text from python-style response strings', () => {
    const payload = {
      conversation_id: '603fd23b-b8a6-44a0-99bb-28d47306ca3d',
      agent_id: 'agent_1a',
      agent_name: 'Data Intelligence',
      response:
        "{'content': [{'text': '\\n', 'type': 'text'}, {'thinking': {'text': '\\nThinking...'}, 'type': 'thinking'}, {'text': \"\\n\\nThere isn't a table called **GBICC** in the databases.\", 'type': 'text'}], 'role': 'assistant'}",
      thread_id: null,
    };

    const parsed = parseChatResponse(payload);

    expect(parsed.conversationId).toBe('603fd23b-b8a6-44a0-99bb-28d47306ca3d');
    expect(parsed.text).toContain('GBICC');
    expect(parsed.text).not.toContain('Thinking');
  });
});

describe('normalizeConversationHistory', () => {
  it('reads messages from conversation envelope', () => {
    const data = {
      id: '603fd23b-b8a6-44a0-99bb-28d47306ca3d',
      application: 'GBICC',
      agent_id: 'agent_1a',
      title: null,
      created_at: '2026-03-26T10:00:00.000Z',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'Select * from gbicc',
          created_at: '2026-03-26T10:01:00.000Z',
        },
        {
          id: 'm2',
          conversation_id: '603fd23b-b8a6-44a0-99bb-28d47306ca3d',
          agent_id: 'agent_1a',
          agent_name: 'Data Intelligence',
          response:
            "{'content': [{'text': 'Here is the answer about **GBICC**.', 'type': 'text'}], 'role': 'assistant'}",
          created_at: '2026-03-26T10:02:00.000Z',
        },
      ],
    };

    const page = normalizeConversationHistory(
      data,
      '603fd23b-b8a6-44a0-99bb-28d47306ca3d',
    );

    expect(page.items).toHaveLength(2);
    expect(page.items[0]?.role).toBe('user');
    expect(page.items[1]?.content).toContain('GBICC');
    expect(page.hasMore).toBe(false);
    expect(page.nextPage).toBeNull();
  });

  it('reads pagination metadata from paginated response envelope', () => {
    const page = normalizeConversationHistory(
      {
        conversation_id: '57647bbb-b6c6-4720-9c88-9b0143ec6f49',
        messages: [
          {
            id: 'm1',
            role: 'user',
            content: 'Give me 3 tickets',
            created_at: '2026-08-05T09:55:27.920409',
          },
        ],
        page: 1,
        page_size: 10,
        total_messages: 6,
        has_more: true,
      },
      '57647bbb-b6c6-4720-9c88-9b0143ec6f49',
    );

    expect(page.conversationId).toBe('57647bbb-b6c6-4720-9c88-9b0143ec6f49');
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(10);
    expect(page.totalMessages).toBe(6);
    expect(page.hasMore).toBe(true);
    expect(page.nextPage).toBe(2);
  });
});

describe('parseChatResponse structured agent payloads', () => {
  const structuredPythonResponse =
    "{'content': [{'tool_use': {'client_side_execute': False, 'input': {'query': 'sample topic'}, 'name': 'DocSearch', 'tool_use_id': 'tool-demo-001', 'type': 'cortex_search'}, 'type': 'tool_use'}, {'tool_result': {'content': [{'json': {'search_results': [{'columns': {'URL': 'https://docs.example.com/pages/100/demo-page'}, 'doc_id': 'doc-100', 'doc_title': 'Demo Page', 'id': 'result-demo-001', 'search_service_name': 'DocSearch', 'source_id': 0, 'text': 'Welcome to the demo documentation space.'}], 'search_results_persist': {}}, 'type': 'json'}], 'name': 'DocSearch', 'status': 'success', 'tool_use_id': 'tool-demo-001', 'type': 'cortex_search'}, 'type': 'tool_result'}, {'thinking': {'text': '\\nReviewing the search results.'}, 'type': 'thinking'}, {'annotations': [{'doc_id': 'doc-100', 'doc_title': 'Demo Page', 'index': 1, 'search_result_id': 'result-demo-001', 'text': 'Welcome', 'type': 'cortex_search_citation'}], 'text': \"\\n\\nHere are some sample documentation pages:\\n\\n1. Demo Page - A sample home page for demo content.\", 'type': 'text'}, {'suggested_queries': [{'query': 'Show pages about onboarding'}, {'query': 'Find pages related to API setup'}, {'query': 'Search the catalog for glossary entries'}], 'type': 'suggested_queries'}], 'metadata': {'usage': {'tokens_consumed': []}}, 'role': 'assistant', 'schema_version': 'v2', 'sequence_number': 1, 'status': 'completed'}";

  it('extracts text, sources, and suggested queries from python-style structured payloads', () => {
    const payload = {
      conversation_id: '00000000-0000-4000-8000-000000000001',
      agent_id: 'agent-docs-demo',
      agent_name: 'Docs Agent',
      response: structuredPythonResponse,
      thread_id: null,
    };

    const parsed = parseChatResponse(payload);

    expect(parsed.conversationId).toBe('00000000-0000-4000-8000-000000000001');
    expect(parsed.text).toContain('sample documentation pages');
    expect(parsed.text).not.toContain('Reviewing the search results');
    expect(parsed.suggestedQueries).toHaveLength(3);
    expect(parsed.suggestedQueries[0]).toContain('onboarding');
    expect(parsed.toolsUsed).toContain('DocSearch');
  });

  it('parses JSON object responses with tool, text, and suggested query blocks', () => {
    const payload = {
      content: [
        { type: 'tool_use', tool_use: { name: 'DocSearch', input: { query: 'demo' } } },
        { type: 'text', text: 'Answer text here.' },
        {
          type: 'suggested_queries',
          suggested_queries: [{ query: 'Follow up one' }],
        },
      ],
    };

    const parsed = parseMessagePayload(payload);
    expect(parsed.text).toBe('Answer text here.');
    expect(parsed.suggestedQueries).toEqual(['Follow up one']);
  });
});
