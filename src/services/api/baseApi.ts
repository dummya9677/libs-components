import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '../../utils/env';

/**
 * Shared base query — always sends cookies; never attaches tokens.
 * Session is an HttpOnly Secure cookie owned by the backend.
 */
export const baseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    return headers;
  },
});
