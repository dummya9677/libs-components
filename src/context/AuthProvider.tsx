import { type ReactNode } from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { oidcConfig } from '@/utils/oidcConfig';
import { useAuthBootstrap } from '@/hooks/useAuth';

interface AuthBootstrapProps {
  children: ReactNode;
}

function AuthBootstrap({ children }: AuthBootstrapProps) {
  useAuthBootstrap();
  return <>{children}</>;
}

interface AppAuthProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with OIDC provider + session bootstrap.
 * Demo mode (`VITE_MOCK_AUTH=true`) still mounts OIDC context so
 * `useAuth` can call `useOidcAuth` safely, but never redirects to the IdP.
 */
export function AppAuthProvider({ children }: AppAuthProviderProps) {
  return (
    <OidcAuthProvider {...oidcConfig}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </OidcAuthProvider>
  );
}
