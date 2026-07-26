import { api } from './apiSlice';
import type { CreateThreadRequest, CreateThreadResponse } from '../../types';
import { env } from '../../utils/env';

function normalizeThreadId(response: {
  thread_id?: string;
  threadId?: string;
}): string {
  const id = response.threadId ?? response.thread_id;
  if (!id) {
    throw new Error('Create thread response did not include a thread id');
  }
  return id;
}

export const threadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createThread: builder.mutation<CreateThreadResponse, CreateThreadRequest>({
      query: (body) => ({
        url: env.api.createThreadPath,
        method: 'POST',
        body: {
          agentId: body.agentId,
          intelligence: body.agentId,
          applicationName: body.applicationName,
          application_name: body.applicationName,
        },
      }),
      transformResponse: (response: CreateThreadResponse | { thread_id?: string }) => ({
        threadId: normalizeThreadId(response),
      }),
      invalidatesTags: ['Conversation'],
    }),
  }),
});

export const { useCreateThreadMutation } = threadApi;
