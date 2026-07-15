import { describe, it, expect } from 'vitest';
import authReducer, {
  setUser,
  logout,
  setLoading,
  checkAuth,
  hasPermission,
  hasRole,
} from '../redux/slice/authSlice';
import type { RootState } from '../redux/store';

const baseState = {
  user: null,
  roles: [] as string[],
  permissions: [] as string[],
  isLoading: true,
};

describe('authSlice', () => {
  it('sets user without storing tokens', () => {
    const next = authReducer(
      baseState,
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        role: ['user'],
        permissions: ['chat:read'],
      }),
    );

    expect(next.user?.email).toBe('user@example.com');
    expect(next.isLoading).toBe(false);
    expect(next.roles).toEqual(['user']);
    expect(next.permissions).toEqual(['chat:read']);
    expect(next).not.toHaveProperty('accessToken');
    expect(next).not.toHaveProperty('refreshToken');
    expect(next).not.toHaveProperty('idToken');
  });

  it('clears user on logout', () => {
    const authenticated = authReducer(
      baseState,
      setUser({
        id: '1',
        email: 'a@b.com',
        name: 'A',
        role: ['admin'],
        permissions: ['all'],
      }),
    );

    const cleared = authReducer(authenticated, logout());
    expect(cleared).toEqual({
      user: null,
      roles: [],
      permissions: [],
      isLoading: false,
    });
  });

  it('toggles loading and checkAuth', () => {
    expect(authReducer(baseState, setLoading(false)).isLoading).toBe(false);
    expect(authReducer(baseState, checkAuth()).isLoading).toBe(false);
  });

  it('hasPermission and hasRole selectors', () => {
    const state = {
      auth: authReducer(
        baseState,
        setUser({
          id: '1',
          email: 'a@b.com',
          name: 'A',
          role: ['admin'],
          permissions: ['chat:read', 'all'],
        }),
      ),
    } as RootState;

    expect(hasPermission(state, 'chat:write')).toBe(true);
    expect(hasRole(state, 'admin')).toBe(true);
    expect(hasRole(state, 'guest')).toBe(false);
  });
});
