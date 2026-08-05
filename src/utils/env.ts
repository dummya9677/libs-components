import type { OidcProvider } from '../types';

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    console.warn(`Missing environment variable: ${name}`);
    return '';
  }
  return value;
};

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'NexaIQ',
  partnerLogoUrl: import.meta.env.VITE_PARTNER_LOGO_URL || '',
  /** Transparent PNG for sidebar bottom promo — e.g. /images/sidebar-assistant-promo.png */
  sidebarPromoImageUrl: import.meta.env.VITE_SIDEBAR_PROMO_IMAGE_URL || '',
  /** Transparent PNG for homepage right-rail multi-agent card */
  multiAgentPromoImageUrl: import.meta.env.VITE_MULTI_AGENT_PROMO_IMAGE_URL || '',
  apiBaseUrl:
    import.meta.env.VITE_MOCK_AUTH === 'true'
      ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      : required(import.meta.env.VITE_API_BASE_URL, 'VITE_API_BASE_URL'),
  /**
   * Paths are appended to `apiBaseUrl` (no leading slash required).
   * Update these in `.env` to match your Python backend.
   */
  api: {
    /** POST — chat endpoint. */
    agentChatPath: import.meta.env.VITE_API_AGENT_CHAT_PATH || '/chat',
    /** GET — agent access list (includes application per agent). */
    agentsPath: import.meta.env.VITE_API_AGENTS_PATH || '/agents',
    /** POST — start or resume a conversation for (user, application, agent). */
    conversationStartPath:
      import.meta.env.VITE_API_CONVERSATION_START_PATH ||
      '/history/conversations/start',
    /** POST — paginated conversation messages. */
    conversationMessagesPath:
      import.meta.env.VITE_API_CONVERSATION_MESSAGES_PATH ||
      '/history/conversations/messages',
  },
  /** When true, skip backend session and hydrate a demo user (UI preview). */
  mockAuth: import.meta.env.VITE_MOCK_AUTH === 'true',
  /**
   * When true, applications/history use local mocks instead of the backend.
   * Defaults to the same value as `VITE_MOCK_AUTH` when unset.
   * Set `VITE_MOCK_API=false` with `VITE_MOCK_AUTH=true` to keep demo login
   * while testing real GET /agents, POST /history/conversations/messages, and POST /chat.
   */
  mockApi:
    import.meta.env.VITE_MOCK_API !== undefined
      ? import.meta.env.VITE_MOCK_API === 'true'
      : import.meta.env.VITE_MOCK_AUTH === 'true',
  oidcProvider: (import.meta.env.VITE_OIDC_PROVIDER || 'entra') as OidcProvider,
  oidc: {
    authority: import.meta.env.VITE_OIDC_AUTHORITY || '',
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID || '',
    redirectUri:
      import.meta.env.VITE_OIDC_REDIRECT_URI ||
      `${window.location.origin}/auth/callback`,
    postLogoutRedirectUri:
      import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI ||
      `${window.location.origin}/login`,
    scope: import.meta.env.VITE_OIDC_SCOPE || 'openid profile email',
  },
  entra: {
    tenantId: import.meta.env.VITE_ENTRA_TENANT_ID || '',
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || '',
    authority: import.meta.env.VITE_ENTRA_AUTHORITY || '',
  },
  okta: {
    domain: import.meta.env.VITE_OKTA_DOMAIN || '',
    clientId: import.meta.env.VITE_OKTA_CLIENT_ID || '',
    authority: import.meta.env.VITE_OKTA_AUTHORITY || '',
  },
  keycloak: {
    url: import.meta.env.VITE_KEYCLOAK_URL || '',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || '',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || '',
  },
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || '',
  },
} as const;
