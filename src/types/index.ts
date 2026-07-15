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
