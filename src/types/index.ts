export type OidcProvider = 'entra' | 'okta' | 'keycloak' | 'auth0';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  designation?: string;
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
  /** Optimistic placeholder while waiting for POST /chat to complete. */
  isPending?: boolean;
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

/** Row from GET /agents — one backend agent scoped to an application. */
export interface BackendAgentAccess {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Backend application id sent to chat/history APIs (e.g. GBICC, SMART_EU). */
  application: string;
  applicationName: string;
  available: boolean;
}

export interface ApplicationOption {
  label: string;
  value: string;
}

export interface ApplicationAgent {
  id: string;
  name: string;
  slug: string;
  description?: string;
  available: boolean;
  conversationId?: string | null;
}

export interface ApplicationWithAgents {
  id: string;
  name: string;
  agents: ApplicationAgent[];
}

export interface StartConversationRequest {
  userId: string;
  application: string;
  agentId: string;
}

export interface StartConversationResponse {
  conversationId: string;
}

/** POST create-thread — legacy; conversation id now comes from GET /applications. */
export interface CreateThreadRequest {
  agentId: string;
  applicationName: string;
}

export interface CreateThreadResponse {
  threadId: string;
}

export interface SendMessageRequest {
  application: string;
  agentId: string;
  message: string;
  conversationId?: string | null;
  userId: string;
}

export interface SendMessageResponse {
  conversationId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}
