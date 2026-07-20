export type OidcProvider = 'entra' | 'okta' | 'keycloak' | 'auth0';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string[];
  permissions: string[];
  avatarUrl?: string;
};

/** Session payload from GET /auth/me and POST /auth/session */
export type AuthMeResponse = AuthUser;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  conversationId: string;
}

/**
 * Message shape used by chat history / infinite scroll.
 * Real API can return the core fields; optional fields support richer UI (demo).
 */
export interface HistoryMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'status' | 'progress' | 'result';
  content?: string;
  createdAt: string;
  conversationId: string;
  bullets?: string[];
  progress?: number;
  progressLabel?: string;
  actions?: { label: string; variant?: 'primary' | 'link' }[];
  followUp?: string;
}

/** Cursor-paginated page of conversation messages (oldest → newest within the page). */
export interface MessagesPage {
  items: HistoryMessage[];
  /** Pass as `cursor` on the next request to load older messages. Null = no more. */
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetMessagesArgs {
  conversationId: string;
  /** Omit / null for the newest page; use `nextCursor` from the previous page for older. */
  cursor?: string | null;
  limit?: number;
}

export interface Conversation {
  id: string;
  title: string;
  agentId: string | null;
  updatedAt: string;
  createdAt: string;
  preview?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface SendMessageRequest {
  conversationId?: string;
  agentId?: string;
  content: string;
}

export interface SendMessageResponse {
  conversationId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}
