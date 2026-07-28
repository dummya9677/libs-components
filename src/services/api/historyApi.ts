import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { api } from './apiSlice';
import { fetchDummyMessagesPage } from '../../data/dummyChatHistory';
import { env } from '../../utils/env';
import { normalizeConversationHistory } from '../../utils/normalizeConversationHistory';
import type {
  Conversation,
  GetMessagesArgs,
  MessagesPage,
} from '../../types';

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

    /**
     * GET /history/conversations/{conversation_id}
     * Returns an empty list when history is unavailable (404 / empty body).
     */
    getConversationHistory: builder.query<MessagesPage, string>({
      async queryFn(conversationId, _api, _extraOptions, baseQuery) {
        if (!conversationId) {
          return {
            data: { items: [], nextCursor: null, hasMore: false },
          };
        }

        if (env.mockAuth) {
          const data = await fetchDummyMessagesPage({
            conversationId,
            limit: 100,
          });
          return { data };
        }

        const result = await baseQuery({
          url: `${env.api.conversationHistoryPath}/${conversationId}`,
        });

        if (result.error) {
          const status =
            typeof result.error === 'object' &&
            result.error !== null &&
            'status' in result.error
              ? result.error.status
              : null;

          if (status === 404) {
            return {
              data: { items: [], nextCursor: null, hasMore: false },
            };
          }

          return { error: result.error as FetchBaseQueryError };
        }

        return {
          data: normalizeConversationHistory(result.data, conversationId),
        };
      },
      providesTags: (_result, _error, conversationId) => [
        { type: 'Message', id: conversationId },
      ],
    }),

    /**
     * Infinite scroll: newest page first, then older pages via `cursor`.
     *
     * Real API (when `VITE_MOCK_AUTH=false`):
     *   GET /history/:conversationId/messages?cursor=&limit=
     *   → { items, nextCursor, hasMore }
     *
     * Cache key is conversationId only; pages are merged in chronological order.
     */
    getConversationMessages: builder.query<MessagesPage, GetMessagesArgs>({
      async queryFn(args, _api, _extraOptions, baseQuery) {
        if (env.mockAuth) {
          const data = await fetchDummyMessagesPage(args);
          return { data };
        }

        const result = await baseQuery({
          url: `${env.api.threadMessagesPath}/${args.conversationId}/messages`,
          params: {
            ...(args.cursor ? { cursor: args.cursor } : {}),
            limit: args.limit ?? 20,
          },
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data as MessagesPage };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.conversationId}`,
      merge: (currentCache, newPage, { arg }) => {
        // First / newest page replaces cache
        if (!arg.cursor || !currentCache) {
          return newPage;
        }

        const seen = new Set(currentCache.items.map((m) => m.id));
        const older = newPage.items.filter((m) => !seen.has(m.id));

        return {
          items: [...older, ...currentCache.items],
          nextCursor: newPage.nextCursor,
          hasMore: newPage.hasMore,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor;
      },
      providesTags: (_result, _error, arg) => [
        { type: 'Message', id: arg.conversationId },
      ],
    }),
  }),
});

export const {
  useGetHistoryQuery,
  useGetConversationQuery,
  useGetConversationHistoryQuery,
  useLazyGetConversationHistoryQuery,
  useGetConversationMessagesQuery,
  useLazyGetConversationMessagesQuery,
} = historyApi;
