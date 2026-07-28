import { agents } from '../data/agents';
import type { ApplicationAgent, ApplicationWithAgents } from '../types';

function normalizeAgentName(value: string): string {
  return value.trim().toLowerCase();
}

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
 * Match the UI agent (slug/id) to the agent entry returned by GET /applications.
 */
export function findAgentInApplication(
  application: ApplicationWithAgents | undefined,
  frontendAgentId: string,
): ApplicationAgent | undefined {
  if (!application) return undefined;

  const frontendAgent = agents.find(
    (agent) => agent.id === frontendAgentId || agent.slug === frontendAgentId,
  );

  return application.agents.find((agent) => {
    if (agent.id === frontendAgentId) return true;
    if (frontendAgent && agent.id === frontendAgent.slug) return true;
    if (
      frontendAgent &&
      normalizeAgentName(agent.name) === normalizeAgentName(frontendAgent.name)
    ) {
      return true;
    }
    return false;
  });
}

export function resolveApplicationAgent(
  applications: ApplicationWithAgents[],
  applicationId: string,
  frontendAgentId: string,
): { application: ApplicationWithAgents; agent: ApplicationAgent } | null {
  const application = findApplicationById(applications, applicationId);
  const agent = findAgentInApplication(application, frontendAgentId);

  if (!application || !agent) return null;

  return { application, agent };
}
