import { agents } from './agents';
import type { BackendAgentAccess } from '../types';

const MOCK_APPLICATIONS = [
  { application: 'GBICC', applicationName: 'GBICC' },
  { application: 'SMART_EU', applicationName: 'SMART EU' },
] as const;

function toBackendAgentId(slug: string, application: string): string {
  return `${slug.replace(/-/g, '')}-${application}`;
}

/** Demo list used when VITE_MOCK_API=true — mirrors GET /agents shape. */
export const mockAgentAccessList: BackendAgentAccess[] = MOCK_APPLICATIONS.flatMap(
  ({ application, applicationName }) =>
    agents
      .filter((agent) => !agent.comingSoon)
      .map((agent) => ({
        id: toBackendAgentId(agent.slug, application),
        slug: agent.slug,
        name: agent.name,
        description: agent.description,
        application,
        applicationName,
        available: true,
      })),
);
