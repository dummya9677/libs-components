import type { OidcProvider } from '../types';

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    console.warn(`Missing environment variable: ${name}`);
    return '';
  }
  return value;
};

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'Demo AI Console',
  apiBaseUrl:
    import.meta.env.VITE_MOCK_AUTH === 'true'
      ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      : required(import.meta.env.VITE_API_BASE_URL, 'VITE_API_BASE_URL'),
  /** When true, skip backend session and hydrate a demo user (UI preview). */
  mockAuth: import.meta.env.VITE_MOCK_AUTH === 'true',
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
