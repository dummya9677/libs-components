import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { mockApplications } from '../../data/applications.mock';
import type { ApplicationAgent, ApplicationWithAgents } from '../../types';
import { env } from '../../utils/env';
import { api } from './apiSlice';

function normalizeAgent(raw: Record<string, unknown>): ApplicationAgent {
  const conversationId =
    raw.conversationId ??
    raw.conversation_id ??
    raw.threadId ??
    raw.thread_id ??
    null;

  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? raw.label ?? raw.id ?? ''),
    conversationId:
      conversationId === null || conversationId === undefined
        ? null
        : String(conversationId),
  };
}

function normalizeApplication(raw: Record<string, unknown>): ApplicationWithAgents {
  const agentsRaw = raw.agents;
  const agents = Array.isArray(agentsRaw)
    ? agentsRaw.map((agent) => normalizeAgent(agent as Record<string, unknown>))
    : [];

  return {
    id: String(raw.id ?? raw.name ?? ''),
    name: String(raw.name ?? raw.label ?? raw.id ?? ''),
    agents,
  };
}

export function normalizeApplicationsResponse(data: unknown): ApplicationWithAgents[] {
  if (Array.isArray(data)) {
    return data.map((item) =>
      normalizeApplication(item as Record<string, unknown>),
    );
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
    getApplications: builder.query<ApplicationWithAgents[], void>({
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
