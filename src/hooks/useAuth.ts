import { useCallback, useEffect } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setLoading,
  setUser,
  logout as logoutAction,
} from '../redux/slice/authSlice';
import {
  useLazyGetMeQuery,
  useLogoutMutation,
  useEstablishSessionMutation,
} from '../services/api';
import { serverAPI } from '../services/apiService';
import { env } from '../utils/env';
import type { AuthUser } from '../types';

const MOCK_USER: AuthUser = {
  id: 'demo-user-1',
  name: 'Demo User',
  email: 'demo.user@example.com',
  role: ['user'],
  permissions: ['all'],
};

/**
 * Application auth hook.
 * Session fetch + setUser live here (not in a redux/thunks layer).
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const oidc = useOidcAuth();
  const auth = useAppSelector((state) => state.auth);
  const { user, roles, permissions, isLoading } = auth;
  const isAuthenticated = Boolean(user);

  const [fetchMe] = useLazyGetMeQuery();
  const [logoutMutation] = useLogoutMutation();
  const [establishSession] = useEstablishSessionMutation();

  const refreshAuth = useCallback(async () => {
    if (env.mockAuth) {
      dispatch(setUser(MOCK_USER));
      return;
    }
    dispatch(setLoading(true));
    try {
      const session = await fetchMe().unwrap();
      dispatch(setUser(session));
    } catch {
      dispatch(setUser(null));
    }
  }, [dispatch, fetchMe]);

  const login = useCallback(async () => {
    if (env.mockAuth) {
      dispatch(setUser(MOCK_USER));
      return;
    }
    await oidc.signinRedirect();
  }, [dispatch, oidc]);

  const completeOidcLogin = useCallback(async () => {
    const idToken = oidc.user?.id_token;
    const session = await establishSession({ idToken }).unwrap();
    dispatch(setUser(session));
    await oidc.removeUser();
  }, [dispatch, establishSession, oidc]);

  const logout = useCallback(async () => {
    if (env.mockAuth) {
      dispatch(logoutAction());
      dispatch(serverAPI.util.resetApiState());
      return;
    }

    try {
      await logoutMutation().unwrap();
    } catch {
      // Still clear local state even if the network call fails
    } finally {
      dispatch(logoutAction());
      dispatch(serverAPI.util.resetApiState());
    }

    try {
      await oidc.signoutRedirect();
    } catch {
      // Backend session already cleared; IdP logout is best-effort
    }
  }, [dispatch, logoutMutation, oidc]);

  return {
    user,
    roles,
    permissions,
    isAuthenticated,
    isLoading: env.mockAuth ? isLoading : isLoading || Boolean(oidc?.isLoading),
    oidcError: env.mockAuth ? undefined : oidc?.error,
    login,
    logout,
    completeOidcLogin,
    refreshAuth,
    can: (permission: string) =>
      Boolean(user) &&
      (permissions.includes(permission) || permissions.includes('all')),
    hasRole: (role: string) => Boolean(user) && roles.includes(role),
  };
}

/**
 * On App mount: restore session (real SSO) or leave logged-out for demo login.
 */
export function useAuthBootstrap() {
  const dispatch = useAppDispatch();
  const [fetchMe] = useLazyGetMeQuery();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Demo mode: stay logged out until user clicks "Sign in as demo user"
      if (env.mockAuth) {
        dispatch(setUser(null));
        return;
      }

      dispatch(setLoading(true));
      try {
        const session = await fetchMe().unwrap();
        if (!cancelled) dispatch(setUser(session));
      } catch {
        if (!cancelled) dispatch(setUser(null));
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [dispatch, fetchMe]);
}
