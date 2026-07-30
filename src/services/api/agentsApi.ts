import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { mockAgentAccessList } from '../../data/agents.mock';
import type { BackendAgentAccess } from '../../types';
import { env } from '../../utils/env';
import { api } from './apiSlice';

function normalizeAgentAccess(raw: Record<string, unknown>): BackendAgentAccess {
  const application = String(raw.application ?? raw.application_id ?? '');
  const applicationName = String(
    raw.application_name ?? raw.applicationName ?? application,
  );

  return {
    id: String(raw.id ?? ''),
    slug: String(raw.slug ?? ''),
    name: String(raw.name ?? ''),
    description: String(raw.description ?? ''),
    application,
    applicationName,
    available: raw.available !== false,
  };
}

export function normalizeAgentsResponse(data: unknown): BackendAgentAccess[] {
  if (Array.isArray(data)) {
    return data.map((item) =>
      normalizeAgentAccess(item as Record<string, unknown>),
    );
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const list = record.items ?? record.agents ?? record.data ?? record.results;

    if (Array.isArray(list)) {
      return normalizeAgentsResponse(list);
    }
  }

  return [];
}

export const agentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query<BackendAgentAccess[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        if (env.mockApi) {
          await new Promise((resolve) => setTimeout(resolve, 120));
          return { data: mockAgentAccessList };
        }

        const result = await baseQuery({
          url: env.api.agentsPath,
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: normalizeAgentsResponse(result.data) };
      },
      providesTags: ['Agent'],
    }),
  }),
});

export const { useGetAgentsQuery } = agentsApi;
