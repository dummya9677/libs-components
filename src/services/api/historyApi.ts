import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { api } from './apiSlice';
import { env } from '../../utils/env';
import type {
  StartConversationRequest,
  StartConversationResponse,
} from '../../types';

function normalizeStartConversationResponse(
  data: unknown,
): StartConversationResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid start conversation response');
  }

  const record = data as Record<string, unknown>;
  const conversationId =
    record.conversation_id ?? record.conversationId ?? record.id;

  if (typeof conversationId !== 'string' || !conversationId.trim()) {
    throw new Error('Start conversation response missing conversation_id');
  }

  return { conversationId: conversationId.trim() };
}

export const historyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation<
      StartConversationResponse,
      StartConversationRequest
    >({
      async queryFn(args, _api, _extraOptions, baseQuery) {
        if (env.mockApi) {
          await new Promise((resolve) => setTimeout(resolve, 80));
          return {
            data: {
              conversationId: `conv-mock-${args.application}-${args.agentId}`,
            },
          };
        }

        const result = await baseQuery({
          url: env.api.conversationStartPath,
          method: 'POST',
          body: {
            user_id: args.userId,
            application: args.application,
            agent_id: args.agentId,
          },
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        try {
          return {
            data: normalizeStartConversationResponse(result.data),
          };
        } catch (err) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: err instanceof Error ? err.message : 'Invalid response',
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: ['Conversation'],
    }),
  }),
});

export const { useStartConversationMutation } = historyApi;
