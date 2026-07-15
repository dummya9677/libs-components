import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { AuthUser } from '@/types';

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  roles: string[];
  permissions: string[];
};

const initialState: AuthState = {
  user: null,
  isLoading: true,
  roles: [],
  permissions: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      if (action.payload) {
        state.roles = action.payload.role;
        state.permissions = action.payload.permissions;
      } else {
        state.roles = [];
        state.permissions = [];
      }
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.roles = [];
      state.permissions = [];
      state.isLoading = false;
    },
    checkAuth: (state) => {
      // Cookie/session: hydrate from /auth/me via RTK Query in the hook,
      // then dispatch setUser(...). This flips loading if mount only needs that.
      state.isLoading = false;
    },
  },
});

export const { setLoading, setUser, logout, checkAuth } = authSlice.actions;

export const hasPermission = (state: RootState, permission: string) => {
  if (!state.auth.user) return false;
  return (
    state.auth.permissions.includes(permission) ||
    state.auth.permissions.includes('all')
  );
};

export const hasRole = (state: RootState, role: string) => {
  if (!state.auth.user) return false;
  return state.auth.roles.includes(role);
};

export default authSlice.reducer;
