import { api } from './apiSlice';
import type { SendMessageRequest, SendMessageResponse } from '../../types';

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversation', 'Message'],
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;
