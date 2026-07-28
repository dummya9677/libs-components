import { api } from './apiSlice';
import type { SendMessageRequest, SendMessageResponse } from '../../types';
import { env } from '../../utils/env';

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (body) => ({
        url: env.api.agentChatPath,
        method: 'POST',
        body: {
          application: body.application,
          agent_id: body.agentId,
          message: body.message,
          conversation_id: body.conversationId ?? null,
          user_id: body.userId,
        },
      }),
      invalidatesTags: ['Conversation', 'Message'],
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;
