import type { AgentColorKey } from '../config/colors';
import { colors } from '../config/colors';

export type FeatureAccent =
  | 'purple'
  | 'blue'
  | 'green'
  | 'orange'
  | 'yellow'
  | 'gold';

export interface AgentCapability {
  label: string;
  icon: 'sparkles' | 'search' | 'shield' | 'layers' | 'book' | 'target' | 'zap' | 'check';
}

export interface AgentAction {
  id: string;
  title: string;
  description: string;
  accent: FeatureAccent;
}

export interface AgentDefinition {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  colorKey: AgentColorKey;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  capabilities: AgentCapability[];
  actions: AgentAction[];
  examples: string[];
  heroVariant: 'cubes' | 'glass' | 'database' | 'book' | 'quality' | 'cost' | 'bau';
  comingSoon?: boolean;
}

export const agents: AgentDefinition[] = [
  {
    id: 'data-quality-intelligence',
    slug: 'data-quality-intelligence',
    name: 'Data Quality Intelligence',
    shortName: 'Data Quality',
    colorKey: 'dataQuality',
    description:
      'Synthesize and summarize findings from all intelligence agents into unified data quality insights.',
    inputLabel: 'Ask about consolidated data quality or agent findings',
    inputPlaceholder:
      'E.g. Summarize all data quality issues found across agents today',
    heroVariant: 'quality',
    capabilities: [
      { label: 'Cross-Agent Synthesis', icon: 'layers' },
      { label: 'Quality Scoring', icon: 'check' },
      { label: 'Unified Reporting', icon: 'book' },
      { label: 'Trend Analysis', icon: 'search' },
    ],
    actions: [
      {
        id: 'summarize',
        title: 'Summarize Agent Findings',
        description: 'Consolidate outputs from all active intelligence agents.',
        accent: 'blue',
      },
      {
        id: 'score',
        title: 'Quality Health Overview',
        description: 'View overall data quality scores and trends.',
        accent: 'green',
      },
      {
        id: 'compare',
        title: 'Compare Agent Outputs',
        description: 'Correlate findings across ticket, data and impact agents.',
        accent: 'purple',
      },
      {
        id: 'report',
        title: 'Generate Quality Report',
        description: 'Create an executive summary of data health.',
        accent: 'orange',
      },
    ],
    examples: [
      'Summarize all findings from today’s investigations',
      'What is the overall data quality score this week?',
      'Which tables have recurring quality issues?',
      'Compare Ticket and Data Intelligence findings for INC-1284',
    ],
  },
  {
    id: 'bau-intelligence',
    slug: 'bau-intelligence',
    name: 'BAU Intelligence',
    shortName: 'BAU',
    colorKey: 'bau',
    description:
      'Monitor business-as-usual operations, track routine health signals and surface operational insights.',
    inputLabel: 'Ask about BAU operations or routine health',
    inputPlaceholder: 'E.g. What routine jobs failed during last night’s BAU window?',
    heroVariant: 'bau',
    comingSoon: true,
    capabilities: [
      { label: 'Routine Monitoring', icon: 'check' },
      { label: 'Operational Insights', icon: 'search' },
      { label: 'Health Signals', icon: 'shield' },
      { label: 'Trend Tracking', icon: 'layers' },
    ],
    actions: [
      {
        id: 'monitor',
        title: 'Monitor BAU Jobs',
        description: 'Track scheduled jobs and routine operational tasks.',
        accent: 'blue',
      },
      {
        id: 'health',
        title: 'Operational Health',
        description: 'View health signals across BAU processes.',
        accent: 'purple',
      },
      {
        id: 'alerts',
        title: 'Routine Alerts',
        description: 'Review alerts from business-as-usual workflows.',
        accent: 'green',
      },
      {
        id: 'trends',
        title: 'BAU Trends',
        description: 'Spot patterns in recurring operational activity.',
        accent: 'orange',
      },
    ],
    examples: [
      'Which BAU jobs failed last night?',
      'Show operational health for today',
      'Summarize routine alerts this week',
      'What changed in BAU workflows yesterday?',
    ],
  },
  {
    id: 'ticket-intelligence',
    slug: 'ticket-intelligence',
    name: 'Ticket Intelligence',
    shortName: 'Ticket',
    colorKey: 'ticket',
    description:
      'Analyze tickets, find root causes and get AI-powered resolution suggestions.',
    inputLabel: 'Describe your issue or ask a question',
    inputPlaceholder:
      'E.g. Why is my sales_report showing lower numbers yesterday?',
    heroVariant: 'cubes',
    capabilities: [
      { label: 'Intent Detection', icon: 'sparkles' },
      { label: 'Root Cause Analysis', icon: 'search' },
      { label: 'Smart Recommendations', icon: 'zap' },
    ],
    actions: [
      {
        id: 'analyze',
        title: 'Analyze a Ticket',
        description: 'Identify issue category, priority and root cause.',
        accent: 'purple',
      },
      {
        id: 'similar',
        title: 'Find Similar Tickets',
        description: 'Search and compare similar resolved tickets.',
        accent: 'blue',
      },
      {
        id: 'resolve',
        title: 'Suggest Resolution',
        description: 'Get AI-recommended solutions and workarounds.',
        accent: 'green',
      },
      {
        id: 'trends',
        title: 'Track Ticket Trends',
        description: 'View trends and recurring issue patterns.',
        accent: 'orange',
      },
    ],
    examples: [
      'Why is ticket INC-1023 still open?',
      'Summarize root cause for INC-8841',
      'Find similar tickets to login failures',
      'Suggest a fix for sales_report delay',
    ],
  },
  {
    id: 'data-intelligence',
    slug: 'data-intelligence',
    name: 'Data Intelligence',
    shortName: 'Data',
    colorKey: 'dataIssue',
    description:
      'Detect data issues, anomalies and root causes across pipelines and datasets.',
    inputLabel: 'Describe your data issue or ask a question',
    inputPlaceholder: 'E.g., Why are there null values in customer_id?',
    heroVariant: 'database',
    capabilities: [
      { label: 'Anomaly Detection', icon: 'sparkles' },
      { label: 'Data Quality Check', icon: 'check' },
      { label: 'Root Cause Analysis', icon: 'search' },
      { label: 'Issue Tracking', icon: 'target' },
    ],
    actions: [
      {
        id: 'anomalies',
        title: 'Detect Anomalies',
        description: 'Find unusual patterns and data anomalies.',
        accent: 'purple',
      },
      {
        id: 'quality',
        title: 'Check Data Quality',
        description: 'Validate data accuracy and consistency.',
        accent: 'blue',
      },
      {
        id: 'root',
        title: 'Find Root Cause',
        description: 'Trace the source of data issues.',
        accent: 'green',
      },
    ],
    examples: [
      'Why are there nulls in customer_id?',
      'Data mismatch in sales_report',
      'Detect outliers in revenue data',
    ],
  },
  {
    id: 'impact-intelligence',
    slug: 'impact-intelligence',
    name: 'Impact Intelligence',
    shortName: 'Impact',
    colorKey: 'impact',
    description:
      'Assess impact of changes, track dependencies and explore lineage.',
    inputLabel: 'Describe your change or ask a question',
    inputPlaceholder:
      "E.g. What's the impact of changing the price column in product_dim?",
    heroVariant: 'glass',
    capabilities: [
      { label: 'Change Impact', icon: 'layers' },
      { label: 'Downstream Analysis', icon: 'search' },
      { label: 'Dependency Mapping', icon: 'target' },
      { label: 'Risk Assessment', icon: 'shield' },
    ],
    actions: [
      {
        id: 'assess',
        title: 'Assess Change Impact',
        description: 'Estimate blast radius across downstream assets.',
        accent: 'purple',
      },
      {
        id: 'map',
        title: 'Map Dependencies',
        description: 'Visualize upstream and downstream relationships.',
        accent: 'blue',
      },
      {
        id: 'risk',
        title: 'Evaluate Risk',
        description: 'Score change risk before you ship.',
        accent: 'green',
      },
      {
        id: 'preview',
        title: 'Preview Impact',
        description: 'Simulate outcomes for proposed schema changes.',
        accent: 'orange',
      },
    ],
    examples: [
      "What's impacted by changing customer_id?",
      'Impact of dropping unused columns',
      'Which dashboards use product_dim?',
      'Risk of renaming price to list_price',
    ],
  },
  {
    id: 'knowledge-intelligence',
    slug: 'knowledge-intelligence',
    name: 'Knowledge Intelligence',
    shortName: 'Knowledge',
    colorKey: 'knowledge',
    description:
      'Search documentation, runbooks, best practices and get expert guidance.',
    inputLabel: 'Ask a question or search knowledge',
    inputPlaceholder: 'E.g. How to set up row-level access for a shared dataset?',
    heroVariant: 'book',
    capabilities: [
      { label: 'Documentation Search', icon: 'book' },
      { label: 'Best Practices', icon: 'check' },
      { label: 'How-To Guides', icon: 'layers' },
      { label: 'Reference Lookup', icon: 'search' },
    ],
    actions: [
      {
        id: 'docs',
        title: 'Search Documentation',
        description: 'Find docs, guides and references.',
        accent: 'orange',
      },
      {
        id: 'practices',
        title: 'Find Best Practices',
        description: 'Learn recommended practices.',
        accent: 'purple',
      },
      {
        id: 'howto',
        title: 'How-To Guides',
        description: 'Step-by-step instructions.',
        accent: 'yellow',
      },
      {
        id: 'reference',
        title: 'Look Up Reference',
        description: 'Find object and function references.',
        accent: 'gold',
      },
    ],
    examples: [
      'How to set up row access policy?',
      'Best practices for indexing large tables',
      'How to create a secure data share?',
      'What are account-level configuration options?',
    ],
  },
  {
    id: 'cost-intelligence',
    slug: 'cost-intelligence',
    name: 'Cost Intelligence',
    shortName: 'Cost',
    colorKey: 'cost',
    description:
      'Track and analyze costs for AI agent usage, table access, compute and platform resources.',
    inputLabel: 'Ask about costs, usage or spending',
    inputPlaceholder:
      'E.g. What did we spend on agent access and table queries this month?',
    heroVariant: 'cost',
    capabilities: [
      { label: 'Agent Cost Tracking', icon: 'target' },
      { label: 'Table Access Costs', icon: 'layers' },
      { label: 'Spend Analytics', icon: 'search' },
      { label: 'Budget Alerts', icon: 'shield' },
    ],
    actions: [
      {
        id: 'agents',
        title: 'Agent Access Costs',
        description: 'View spend per intelligence agent and API calls.',
        accent: 'purple',
      },
      {
        id: 'tables',
        title: 'Table & Storage Costs',
        description: 'Break down costs by table, schema and data access.',
        accent: 'blue',
      },
      {
        id: 'breakdown',
        title: 'Cost Breakdown by Team',
        description: 'See who is driving platform and agent spend.',
        accent: 'green',
      },
      {
        id: 'forecast',
        title: 'Budget Forecast',
        description: 'Project monthly spend and flag overages early.',
        accent: 'orange',
      },
    ],
    examples: [
      'What did Ticket Intelligence cost this month?',
      'Show storage costs for sales_report table',
      'Which agent has the highest access cost?',
      'Forecast compute spend for next quarter',
    ],
  },
];

export const DEFAULT_AGENT_SLUG = 'data-quality-intelligence';

export function getAgentBySlug(slug?: string): AgentDefinition {
  return agents.find((a) => a.slug === slug) ?? agents[0];
}

export function getAgentTheme(colorKey: AgentColorKey) {
  return colors.agents[colorKey];
}
