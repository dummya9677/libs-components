import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useOidcAuth } from 'react-oidc-context';
import { Loader } from '../../components/Loader';
import { useAuth } from '../../hooks/useAuth';

export function AuthCallbackPage() {
  const oidc = useOidcAuth();
  const { completeOidcLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    if (oidc.isAuthenticated && oidc.user) {
      void completeOidcLogin()
        .then(() => navigate('/', { replace: true }))
        .catch(() => undefined);
    }
  }, [
    oidc.isAuthenticated,
    oidc.user,
    completeOidcLogin,
    isAuthenticated,
    navigate,
  ]);

  if (oidc.error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-status-danger/30 bg-red-50 p-6 text-sm text-status-danger">
          <p>{oidc.error.message}</p>
          <button
            type="button"
            className="mt-4 font-semibold underline"
            onClick={() => navigate('/login')}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return <Loader fullScreen message="Completing sign-in…" />;
}
