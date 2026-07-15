import {
  InMemoryWebStorage,
  WebStorageStateStore,
  type UserManagerSettings,
} from 'oidc-client-ts';
import { env } from '@/utils/env';
import type { OidcProvider } from '@/types';

/**
 * Resolve OIDC settings for the configured identity provider.
 * Tokens are held in memory only — never localStorage/sessionStorage.
 * Backend owns the lasting session via HttpOnly Secure cookie.
 */
function resolveProviderSettings(provider: OidcProvider): {
  authority: string;
  client_id: string;
  extraQueryParams?: Record<string, string>;
} {
  switch (provider) {
    case 'entra': {
      const authority =
        env.entra.authority ||
        (env.entra.tenantId
          ? `https://login.microsoftonline.com/${env.entra.tenantId}/v2.0`
          : env.oidc.authority);
      return {
        authority,
        client_id: env.entra.clientId || env.oidc.clientId,
      };
    }
    case 'okta':
      return {
        authority: env.okta.authority || env.okta.domain || env.oidc.authority,
        client_id: env.okta.clientId || env.oidc.clientId,
      };
    case 'keycloak': {
      const authority =
        env.keycloak.url && env.keycloak.realm
          ? `${env.keycloak.url}/realms/${env.keycloak.realm}`
          : env.oidc.authority;
      return {
        authority,
        client_id: env.keycloak.clientId || env.oidc.clientId,
      };
    }
    case 'auth0':
      return {
        authority: env.auth0.domain || env.oidc.authority,
        client_id: env.auth0.clientId || env.oidc.clientId,
        extraQueryParams: env.auth0.audience
          ? { audience: env.auth0.audience }
          : undefined,
      };
    default:
      return {
        authority: env.oidc.authority,
        client_id: env.oidc.clientId,
      };
  }
}

const providerSettings = resolveProviderSettings(env.oidcProvider);

/**
 * OIDC UserManager settings.
 * - userStore: in-memory only (no JWT in localStorage/sessionStorage)
 * - stateStore: sessionStorage for CSRF state across IdP redirect only
 */
export const oidcConfig: UserManagerSettings = {
  authority: providerSettings.authority,
  client_id: providerSettings.client_id,
  redirect_uri: env.oidc.redirectUri,
  post_logout_redirect_uri: env.oidc.postLogoutRedirectUri,
  response_type: 'code',
  scope: env.oidc.scope,
  automaticSilentRenew: false,
  loadUserInfo: false,
  monitorSession: false,
  userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
  stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
  extraQueryParams: providerSettings.extraQueryParams,
};
