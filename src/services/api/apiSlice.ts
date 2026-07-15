import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/services/api/baseApi';

/**
 * Empty API shell — feature endpoints are injected from dedicated service modules.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'Conversation', 'Agent', 'Message'],
  endpoints: () => ({}),
});
