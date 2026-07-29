import { findBackendAgent } from '../data/backendAgents';
import type { ApplicationWithAgents } from '../types';

export function findApplicationById(
  applications: ApplicationWithAgents[],
  applicationId: string,
): ApplicationWithAgents | undefined {
  if (!applicationId) return undefined;

  return applications.find(
    (app) => app.id === applicationId || app.name === applicationId,
  );
}

/**
 * Resolve the static backend agent for a UI agent slug/id.
 */
export function findAgentForFrontend(frontendAgentId: string) {
  return findBackendAgent(frontendAgentId);
}

export function resolveApplicationAgent(
  applications: ApplicationWithAgents[],
  applicationId: string,
  frontendAgentId: string,
): {
  application: ApplicationWithAgents;
  agent: { id: string; name: string };
} | null {
  const application = findApplicationById(applications, applicationId);
  const agent = findBackendAgent(frontendAgentId);

  if (!application || !agent) return null;

  return {
    application,
    agent: { id: agent.id, name: agent.name },
  };
}
