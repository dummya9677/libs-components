/**
 * Static agent catalog for the backend.
 * GET /api/agents is not called — these ids are sent to
 * POST /history/conversations/start and POST /chat.
 */
export interface BackendAgentDefinition {
  id: string;
  name: string;
  description: string;
  /** Frontend route slug (matches AgentDefinition.slug). */
  slug: string;
}

export const backendAgents: BackendAgentDefinition[] = [
  {
    id: 'dataqualityintelligence',
    slug: 'data-quality-intelligence',
    name: 'Data Quality Intelligence',
    description:
      'Synthesize and summarize findings from all intelligence agents into unified data quality insights.',
  },
  {
    id: 'bauintelligence',
    slug: 'bau-intelligence',
    name: 'BAU Intelligence',
    description:
      'Monitor business-as-usual operations, track routine health signals and surface operational insights.',
  },
  {
    id: 'ticketintelligence',
    slug: 'ticket-intelligence',
    name: 'Ticket Intelligence',
    description:
      'Analyze tickets, find root causes and get AI-powered resolution suggestions.',
  },
  {
    id: 'dataintelligence',
    slug: 'data-intelligence',
    name: 'Data Intelligence',
    description:
      'Detect data issues, anomalies and root causes across pipelines and datasets.',
  },
  {
    id: 'impactintelligence',
    slug: 'impact-intelligence',
    name: 'Impact Intelligence',
    description:
      'Assess impact of changes, track dependencies and explore lineage.',
  },
  {
    id: 'knowledgeintelligence',
    slug: 'knowledge-intelligence',
    name: 'Knowledge Intelligence',
    description:
      'Search documentation, runbooks, best practices and get expert guidance.',
  },
  {
    id: 'costintelligence',
    slug: 'cost-intelligence',
    name: 'Cost Intelligence',
    description:
      'Track and analyze costs for AI agent usage, table access, compute and platform resources.',
  },
];

export function findBackendAgent(
  frontendAgentId: string,
): BackendAgentDefinition | undefined {
  if (!frontendAgentId) return undefined;

  return backendAgents.find(
    (agent) => agent.slug === frontendAgentId || agent.id === frontendAgentId,
  );
}
