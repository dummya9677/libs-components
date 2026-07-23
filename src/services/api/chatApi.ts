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
          ...body,
          // Prefer threadId; fall back to conversationId for older call sites.
          threadId: body.threadId ?? body.conversationId,
        },
      }),
      invalidatesTags: ['Conversation', 'Message'],
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;
