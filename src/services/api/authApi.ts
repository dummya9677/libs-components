import { api } from '@/services/api/apiSlice';
import type { AuthMeResponse } from '@/types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<AuthMeResponse, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    establishSession: builder.mutation<AuthMeResponse, { idToken?: string }>({
      query: (body) => ({
        url: '/auth/session',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useEstablishSessionMutation,
} = authApi;
