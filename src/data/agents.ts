import type { AgentColorKey } from '../config/colors';
import { colors } from '../config/colors';
import { minutesAgoIso } from '../utils/time';

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

export interface AgentDemoMessage {
  id: string;
  role: 'assistant' | 'user' | 'status' | 'progress' | 'result';
  content?: string;
  bullets?: string[];
  progress?: number;
  progressLabel?: string;
  actions?: { label: string; variant?: 'primary' | 'link' }[];
  sentAt?: string;
  followUp?: string;
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
  demoMessages: AgentDemoMessage[];
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
    demoMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Assistant. How can I help you today?",
        sentAt: minutesAgoIso(5),
      },
      {
        id: '2',
        role: 'user',
        content: 'Summarize all data quality findings from today’s investigations',
        sentAt: minutesAgoIso(5),
      },
      {
        id: '3',
        role: 'status',
        content:
          'Gathering outputs from Ticket, Data, Impact and Knowledge Intelligence agents...',
      },
      {
        id: '4',
        role: 'progress',
        progress: 82,
        progressLabel: 'Data Quality Intelligence · Synthesizing agent findings…',
      },
      {
        id: '5',
        role: 'result',
        content: "Here's your consolidated data quality summary:",
        bullets: [
          'Overall quality score: 87% (↑ 3% vs yesterday)',
          '4 active issues across 3 datasets — 2 high priority',
          'sales_report: ETL delay flagged by Ticket & Data Intelligence',
          'customer_id nulls in staging — 18% records affected',
          'product_dim schema change risk identified by Impact Intelligence',
        ],
        followUp: 'Would you like a detailed breakdown by agent?',
        actions: [
          { label: 'View by agent', variant: 'primary' },
          { label: 'Export report', variant: 'link' },
        ],
        sentAt: minutesAgoIso(0),
      },
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
    demoMessages: [],
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
    demoMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Assistant. How can I help you today?",
        sentAt: minutesAgoIso(12),
      },
      {
        id: '2',
        role: 'user',
        content: 'Why is my sales_report showing lower numbers yesterday?',
        sentAt: minutesAgoIso(8),
      },
      {
        id: '3',
        role: 'status',
        content: "I'll analyze this for you using the Ticket Intelligence agent.",
        sentAt: minutesAgoIso(7),
      },
      {
        id: '4',
        role: 'progress',
        progress: 75,
        progressLabel: 'Ticket Intelligence · Analyzing your query…',
        sentAt: minutesAgoIso(6),
      },
      {
        id: '5',
        role: 'result',
        content: "Here's what I found:",
        bullets: [
          'Data refresh delay in sales_summary table',
          'Upstream ETL job completed 42 minutes late',
          '3 related open tickets with the same pattern',
        ],
        actions: [
          { label: 'Yes, suggest a fix', variant: 'primary' },
          { label: 'Show more details', variant: 'link' },
        ],
        sentAt: minutesAgoIso(5),
      },
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
    demoMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Assistant. How can I help you today?",
        sentAt: minutesAgoIso(5),
      },
      {
        id: '2',
        role: 'user',
        content: 'Why are there null values in customer_id?',
        sentAt: minutesAgoIso(5),
      },
      {
        id: '3',
        role: 'status',
        content: 'Analyzing your data issue with the Data Intelligence agent...',
      },
      {
        id: '4',
        role: 'progress',
        progress: 78,
        progressLabel: 'Detecting anomalies and root cause analysis...',
      },
      {
        id: '5',
        role: 'result',
        content: "Here's what I found:",
        bullets: [
          'Nulls introduced in staging.customer_data',
          'Missing values after customer update flow',
          '18% of records affected',
          'Issue started 2 days ago after source update.',
        ],
        followUp: 'Would you like me to suggest a resolution step?',
        actions: [
          { label: 'Show resolution steps', variant: 'link' },
          { label: 'Monitor this issue', variant: 'link' },
        ],
        sentAt: minutesAgoIso(0),
      },
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
    demoMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Assistant. How can I help you today?",
        sentAt: minutesAgoIso(5),
      },
      {
        id: '2',
        role: 'user',
        content:
          "What's the impact of changing the price column type in product_dim?",
        sentAt: minutesAgoIso(5),
      },
      {
        id: '3',
        role: 'status',
        content: 'Analyzing impact using the Impact Intelligence agent...',
      },
      {
        id: '4',
        role: 'progress',
        progress: 68,
        progressLabel: 'Mapping dependencies and evaluating impact...',
      },
      {
        id: '5',
        role: 'result',
        content: "Here's what I found:",
        bullets: [
          '8 downstream tables will be impacted',
          '12 reports and dashboards affected',
          '2 data quality rules may fail',
          'High risk of data type mismatch in 1 pipeline',
        ],
        followUp: 'Would you like me to show the impact details?',
        actions: [
          { label: 'Show impact details', variant: 'link' },
          { label: 'Suggest safer change', variant: 'link' },
        ],
        sentAt: minutesAgoIso(0),
      },
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
    demoMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Assistant. How can I help you today?",
        sentAt: minutesAgoIso(5),
      },
      {
        id: '2',
        role: 'user',
        content: 'How do I reduce compute cost for overnight batch jobs?',
        sentAt: minutesAgoIso(5),
      },
      {
        id: '3',
        role: 'status',
        content: 'Searching your knowledge base...',
      },
      {
        id: '4',
        role: 'progress',
        progress: 88,
        progressLabel: 'Finding relevant docs and best practices...',
      },
      {
        id: '5',
        role: 'result',
        content: "Here's what I found:",
        bullets: [
          'Auto-pause idle workers after 60 seconds',
          'Right-size job runners — start small and scale up',
          'Use budget alerts to cap spend',
          'Cache results and avoid repeated large scans',
        ],
        followUp: 'Would you like me to open the top guide?',
        actions: [
          { label: 'Open best practice guide', variant: 'link' },
          { label: 'Show more results', variant: 'link' },
        ],
        sentAt: minutesAgoIso(0),
      },
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
    demoMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Assistant. How can I help you today?",
        sentAt: minutesAgoIso(5),
      },
      {
        id: '2',
        role: 'user',
        content: 'What are we paying for agent access and table queries this month?',
        sentAt: minutesAgoIso(5),
      },
      {
        id: '3',
        role: 'status',
        content: 'Analyzing agent usage and data access costs...',
      },
      {
        id: '4',
        role: 'progress',
        progress: 71,
        progressLabel: 'Cost Intelligence · Aggregating spend data…',
      },
      {
        id: '5',
        role: 'result',
        content: "Here's your cost breakdown for March:",
        bullets: [
          'Total spend: $42,380 (↑ 12% vs last month)',
          'Agent access: $8,240 — Ticket Intelligence $2,940 (highest)',
          'Table queries: $18,600 — sales_report $4,200, customer_data $3,100',
          'Compute & storage: $15,540 — warehouse auto-scale drove +17%',
        ],
        followUp: 'Would you like to set a budget alert for any category?',
        actions: [
          { label: 'View detailed breakdown', variant: 'primary' },
          { label: 'Set budget alert', variant: 'link' },
        ],
        sentAt: minutesAgoIso(0),
      },
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
