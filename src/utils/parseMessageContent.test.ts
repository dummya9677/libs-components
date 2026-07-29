import { describe, expect, it } from 'vitest';
import { parseChatResponse } from './parseChatResponse';
import { normalizeConversationHistory } from './normalizeConversationHistory';

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
  });
});
