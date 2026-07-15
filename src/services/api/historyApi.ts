import { api } from '@/services/api/apiSlice';
import type { Conversation } from '@/types';

export const historyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.query<Conversation[], void>({
      query: () => '/history',
      providesTags: ['Conversation'],
    }),
    getConversation: builder.query<Conversation, string>({
      query: (id) => `/history/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Conversation', id }],
    }),
  }),
});

export const { useGetHistoryQuery, useGetConversationQuery } = historyApi;
