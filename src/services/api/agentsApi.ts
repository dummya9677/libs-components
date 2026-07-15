import { api } from '@/services/api/apiSlice';
import type { Agent } from '@/types';

export const agentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query<Agent[], void>({
      query: () => '/agents',
      providesTags: ['Agent'],
    }),
  }),
});

export const { useGetAgentsQuery } = agentsApi;
