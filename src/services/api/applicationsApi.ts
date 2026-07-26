import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { mockApplications } from '../../data/applications.mock';
import type { ApplicationOption } from '../../types';
import { env } from '../../utils/env';
import { api } from './apiSlice';

function normalizeApplicationsResponse(data: unknown): ApplicationOption[] {
  if (Array.isArray(data)) {
    return data.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        label: String(row.label ?? row.name ?? row.value ?? ''),
        value: String(row.value ?? row.id ?? row.name ?? ''),
      };
    });
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const list =
      record.items ?? record.applications ?? record.data ?? record.results;

    if (Array.isArray(list)) {
      return normalizeApplicationsResponse(list);
    }
  }

  return [];
}

export const applicationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query<ApplicationOption[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        if (env.mockAuth) {
          await new Promise((resolve) => setTimeout(resolve, 120));
          return { data: mockApplications };
        }

        const result = await baseQuery({
          url: env.api.applicationsPath,
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: normalizeApplicationsResponse(result.data) };
      },
      providesTags: ['Application'],
    }),
  }),
});

export const { useGetApplicationsQuery } = applicationsApi;
