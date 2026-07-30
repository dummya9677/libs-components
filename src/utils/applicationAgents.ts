import type { ApplicationWithAgents, BackendAgentAccess } from '../types';

export const EMPTY_AGENT_ACCESS_LIST: BackendAgentAccess[] = [];

export function findApplicationById(
  applications: ApplicationWithAgents[],
  applicationId: string,
): ApplicationWithAgents | undefined {
  if (!applicationId) return undefined;

  return applications.find(
    (app) => app.id === applicationId || app.name === applicationId,
  );
}

export function groupAgentsByApplication(
  agents: BackendAgentAccess[],
): ApplicationWithAgents[] {
  const map = new Map<string, ApplicationWithAgents>();

  for (const agent of agents) {
    if (!agent.application) continue;

    let application = map.get(agent.application);
    if (!application) {
      application = {
        id: agent.application,
        name: agent.applicationName || agent.application,
        agents: [],
      };
      map.set(agent.application, application);
    }

    application.agents.push({
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      available: agent.available,
    });
  }

  return Array.from(map.values());
}

/**
 * Applications for the company dropdown, derived from GET /agents.
 * When `agentSlug` is set (assistant page), only companies with that agent available are returned.
 */
export function getApplicationsForDropdown(
  agents: BackendAgentAccess[],
  agentSlug?: string,
): ApplicationWithAgents[] {
  const availableAgents = agents.filter((agent) => agent.available);

  if (agentSlug) {
    const applicationIds = new Set(
      availableAgents
        .filter((agent) => agent.slug === agentSlug)
        .map((agent) => agent.application),
    );

    return groupAgentsByApplication(availableAgents).filter((application) =>
      applicationIds.has(application.id),
    );
  }

  const applicationIds = new Set(
    availableAgents.map((agent) => agent.application),
  );

  return groupAgentsByApplication(availableAgents).filter((application) =>
    applicationIds.has(application.id),
  );
}

export function findAgentAccess(
  agents: BackendAgentAccess[],
  applicationId: string,
  frontendAgentSlug: string,
): BackendAgentAccess | undefined {
  if (!applicationId || !frontendAgentSlug) return undefined;

  return agents.find(
    (agent) =>
      (agent.application === applicationId ||
        agent.applicationName === applicationId) &&
      agent.slug === frontendAgentSlug &&
      agent.available,
  );
}

export function resolveApplicationAgent(
  agents: BackendAgentAccess[],
  applicationId: string,
  frontendAgentSlug: string,
): {
  application: ApplicationWithAgents;
  agent: { id: string; name: string };
} | null {
  const applications = groupAgentsByApplication(agents);
  const application = findApplicationById(applications, applicationId);
  const agentAccess = findAgentAccess(agents, applicationId, frontendAgentSlug);

  if (!application || !agentAccess) return null;

  return {
    application,
    agent: { id: agentAccess.id, name: agentAccess.name },
  };
}
