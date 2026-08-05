import type { MessagesPage } from '../../types';
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

export function normalizeConversationMessagesResponse(
  data: unknown,
  args: FetchConversationMessagesArgs,
): MessagesPage {
  const fallbackConversationId =
    args.conversationId?.trim() ||
    `pending-${args.application}-${args.agentId}`;

  return normalizeConversationHistory(data, fallbackConversationId);
}
