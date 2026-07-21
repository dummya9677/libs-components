import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/Loader';
import { BrandLockup } from '../../components/brand/BrandLockup';
import { env } from '../../utils/env';

export function LoginPage() {
  const { isAuthenticated, isLoading, login, oidcError } = useAuth();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || '/';

  useEffect(() => {
    document.title = `Sign in · ${env.appName}`;
  }, []);

  if (isLoading) {
    return <Loader fullScreen message="Loading…" />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex h-full min-h-dvh items-center justify-center overflow-y-auto bg-app-bg p-4">
      <div className="w-full max-w-md rounded-2xl border border-app-border bg-surface p-8 shadow-card">
        <BrandLockup variant="login" className="mb-6" />
        <h1 className="text-2xl font-bold text-ink">{env.appName}</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          {env.mockAuth
            ? 'Demo mode — sign in with a placeholder account. No backend or SSO required.'
            : 'Sign in with your enterprise account to continue.'}
        </p>

        {!env.mockAuth && oidcError ? (
          <div className="mt-4 rounded-lg border border-status-danger/30 bg-red-50 px-3 py-2 text-sm text-status-danger">
            Authentication error: {oidcError.message}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            void login();
          }}
          className="mt-6 w-full rounded-xl bg-client-blue-helix-dark px-4 py-3 text-sm font-semibold text-white transition hover:bg-client-primary"
        >
          {env.mockAuth ? 'Sign in as demo user' : 'Sign in with SSO'}
        </button>

        {env.mockAuth ? (
          <p className="mt-4 text-center text-[11px] text-ink-muted">
            Demo auth enabled · Protected routes require sign-in
          </p>
        ) : (
          <p className="mt-4 text-center text-[11px] text-ink-muted">
            Provider: {env.oidcProvider.toUpperCase()} · Session secured by
            HttpOnly cookie
          </p>
        )}
      </div>
    </div>
  );
}
