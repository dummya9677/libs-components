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
  /** ISO timestamp — shown as relative time on the message */
  sentAt?: string;
  /** Extra line after bullets (e.g. follow-up question) */
  followUp?: string;
}

export interface AgentDefinition {
  id: string;
  slug: string;
  name: string;
  colorKey: AgentColorKey;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  capabilities: AgentCapability[];
  actions: AgentAction[];
  examples: string[];
  demoMessages: AgentDemoMessage[];
  heroVariant: 'cubes' | 'glass' | 'database' | 'book';
}

export const agents: AgentDefinition[] = [
  {
    id: 'ticket-analyzer',
    slug: 'ticket-analyzer',
    name: 'Ticket Analyzer',
    colorKey: 'ticket',
    description:
      'Analyze and resolve support tickets faster with AI-powered insights.',
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
        content: "I'll analyze this for you using the Ticket Analyzer agent.",
        sentAt: minutesAgoIso(7),
      },
      {
        id: '4',
        role: 'progress',
        progress: 75,
        progressLabel: 'Ticket Analyzer · Analyzing your query…',
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
    id: 'impact-analyzer',
    slug: 'impact-analyzer',
    name: 'Impact Analyzer',
    colorKey: 'impact',
    description:
      'Assess the potential impact of changes across data, systems and downstream processes.',
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
        content: 'Analyzing impact using the Impact Analyzer agent...',
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
    id: 'data-issue-analyzer',
    slug: 'data-issue-analyzer',
    name: 'Data Issue Analyzer',
    colorKey: 'dataIssue',
    description:
      'Detect, analyze and troubleshoot data issues across your pipelines and datasets.',
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
        content: 'Analyzing your data issue with the Data Issue Analyzer agent...',
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
    id: 'knowledge-assistant',
    slug: 'knowledge-assistant',
    name: 'Knowledge Assistant',
    colorKey: 'knowledge',
    description:
      'Get answers, documentation and best practices from your knowledge base.',
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
];

export const DEFAULT_AGENT_SLUG = 'data-issue-analyzer';

export function getAgentBySlug(slug?: string): AgentDefinition {
  return agents.find((a) => a.slug === slug) ?? agents[0];
}

export function getAgentTheme(colorKey: AgentColorKey) {
  return colors.agents[colorKey];
}
