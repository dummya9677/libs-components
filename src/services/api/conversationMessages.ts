import { fetchDummyMessagesPage } from '../../data/dummyChatHistory';
import type { MessagesPage } from '../../types';
import { env } from '../../utils/env';
import { normalizeConversationHistory } from '../../utils/normalizeConversationHistory';

/** POST /history/conversations/messages */
export const CONVERSATION_MESSAGES_PATH = '/history/conversations/messages';

export const CONVERSATION_MESSAGES_PAGE_SIZE = 10;

export interface ConversationMessagesBody {
  user_id: string;
  application: string;
  agent_id: string;
  page: number;
  page_size: number;
}

export interface FetchConversationMessagesArgs {
  userId: string;
  application: string;
  agentId: string;
  conversationId?: string;
  page?: number;
}

export function buildConversationMessagesBody(
  args: FetchConversationMessagesArgs,
): ConversationMessagesBody {
  return {
    user_id: args.userId,
    application: args.application,
    agent_id: args.agentId,
    page: args.page ?? 1,
    page_size: CONVERSATION_MESSAGES_PAGE_SIZE,
  };
}

function buildConversationMessagesUrl(): string {
  const base = env.apiBaseUrl.replace(/\/$/, '');
  return `${base}${CONVERSATION_MESSAGES_PATH}`;
}

/**
 * POST /history/conversations/messages
 * Always uses native fetch with method POST — not RTK Query.
 */
export async function postConversationMessages(
  args: FetchConversationMessagesArgs,
): Promise<MessagesPage> {
  const body = buildConversationMessagesBody(args);
  const fallbackConversationId =
    args.conversationId?.trim() ||
    `pending-${args.application}-${args.agentId}`;

  if (!body.user_id || !body.application || !body.agent_id) {
    return normalizeConversationHistory(null, fallbackConversationId);
  }

  if (env.mockApi) {
    return fetchDummyMessagesPage({
      userId: args.userId,
      application: args.application,
      agentId: args.agentId,
      page: body.page,
      pageSize: body.page_size,
    });
  }

  const response = await fetch(buildConversationMessagesUrl(), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.status === 404) {
    return normalizeConversationHistory(null, fallbackConversationId);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      detail.trim() ||
        `Failed to load conversation messages (${response.status}).`,
    );
  }

  const data: unknown = await response.json();
  return normalizeConversationHistory(data, fallbackConversationId);
}
