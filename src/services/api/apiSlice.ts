import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

/**
 * Empty API shell — feature endpoints are injected from dedicated service modules.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'Conversation', 'Agent', 'Message', 'ApplicationHealth', 'Notification', 'Application'],
  endpoints: () => ({}),
});
