/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MOCK_AUTH: string;
  readonly VITE_OIDC_PROVIDER: 'entra' | 'okta' | 'keycloak' | 'auth0';
  readonly VITE_OIDC_AUTHORITY: string;
  readonly VITE_OIDC_CLIENT_ID: string;
  readonly VITE_OIDC_REDIRECT_URI: string;
  readonly VITE_OIDC_POST_LOGOUT_REDIRECT_URI: string;
  readonly VITE_OIDC_SCOPE: string;
  readonly VITE_ENTRA_TENANT_ID: string;
  readonly VITE_ENTRA_CLIENT_ID: string;
  readonly VITE_ENTRA_AUTHORITY: string;
  readonly VITE_OKTA_DOMAIN: string;
  readonly VITE_OKTA_CLIENT_ID: string;
  readonly VITE_OKTA_AUTHORITY: string;
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
