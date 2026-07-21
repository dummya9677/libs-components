import { api } from './apiSlice';
import { mockApplicationHealth } from '../../data/applicationHealth.mock';
import type { ApplicationHealthSummary } from '../../types/applicationHealth';

export const applicationHealthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getApplicationHealth: builder.query<ApplicationHealthSummary, void>({
      // Swap queryFn for a real endpoint when backend is ready:
      // query: () => '/dashboard/application-health',
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
        return { data: mockApplicationHealth };
      },
      providesTags: ['ApplicationHealth'],
    }),
  }),
});

export const { useGetApplicationHealthQuery } = applicationHealthApi;
