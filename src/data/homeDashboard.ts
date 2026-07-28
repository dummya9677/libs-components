export const homeKpis = [
  { label: 'MTTR', value: '1.4 hrs', delta: '+18% vs last 7d', positive: true },
  { label: 'Auto Resolution', value: '68%', delta: '↑ 12% vs last 7d', positive: true },
  { label: 'Ticket Prediction', value: '91%', delta: '↑ 8% vs last 7d', positive: true },
  { label: 'SLA Compliance', value: '98%', delta: '↑ 5% vs last 7d', positive: true },
  { label: 'Cost Saved', value: '$1.8M', delta: '↑ 24% vs last 30d', positive: true },
];

export const suggestedQueries = [
  'Why did sales report decrease?',
  'Which dashboards are impacted?',
  'Show me ETL failures today',
  'What is the root cause of INC-1284?',
];

export const comingSoonAgents = [
  'SQL Intelligence',
  'Release Intelligence',
  'Security Intelligence',
];

export const recentInvestigations = [
  {
    id: '1',
    title: 'Why did Sales Report decrease?',
    status: 'Completed',
    ref: 'INC-1284',
    time: '10 min ago',
    variant: 'ticket' as const,
  },
  {
    id: '2',
    title: 'Customer_ID null issue in staging',
    status: 'Completed',
    ref: 'INC-1277',
    time: '1 hr ago',
    variant: 'ticket' as const,
  },
  {
    id: '3',
    title: 'Warehouse cost analysis',
    status: 'Completed',
    ref: 'FIN-3551',
    time: '3 hr ago',
    variant: 'finance' as const,
  },
  {
    id: '4',
    title: 'Payment failure root cause',
    status: 'Completed',
    ref: 'INC-1266',
    time: '5 hr ago',
    variant: 'finance' as const,
  },
  {
    id: '5',
    title: 'Loan pipeline delay analysis',
    status: 'Completed',
    ref: 'INC-1244',
    time: 'Yesterday',
    variant: 'finance' as const,
  },
];

export const recommendedActions = [
  {
    id: '1',
    title: "Investigate yesterday's ETL failure",
    priority: 'High' as const,
    icon: 'alert' as const,
  },
  {
    id: '2',
    title: 'Review 2 high-risk schema changes',
    priority: 'High' as const,
    icon: 'schema' as const,
  },
  {
    id: '3',
    title: 'Optimize warehouse WH_...',
    priority: 'Medium' as const,
    icon: 'optimize' as const,
  },
  {
    id: '4',
    title: 'Refresh stale dashboard cache',
    priority: 'Low' as const,
    icon: 'refresh' as const,
  },
  {
    id: '5',
    title: 'Update documentation for new pipeline',
    priority: 'Low' as const,
    icon: 'document' as const,
  },
];

export const aiInsights = [
  {
    id: '1',
    title: 'ETL failures increased 28%',
    subtitle: 'Compared to yesterday · staging pipeline',
    time: '12 min ago',
    type: 'warning' as const,
  },
  {
    id: '2',
    title: 'Customer dimension updated yesterday',
    subtitle: 'Potential impact on 6 reports',
    time: '28 min ago',
    type: 'info' as const,
  },
  {
    id: '3',
    title: 'Warehouse costs increased 17%',
    subtitle: 'Optimize WH_PROD_L',
    time: '34 min ago',
    type: 'cost' as const,
  },
  {
    id: '4',
    title: 'No failed deployments today',
    subtitle: 'All pipelines healthy',
    time: '1 hr ago',
    type: 'success' as const,
  },
  {
    id: '5',
    title: '83% tickets auto-resolved',
    subtitle: '↑ 12% improvement',
    time: '1 hr ago',
    type: 'success' as const,
  },
];

export const intelligenceStats = [
  { label: 'AI Agents Online', value: '24', icon: 'bot' as const },
  { label: 'Auto Resolution', value: '83%', icon: 'trend' as const },
  { label: 'Active Investigations', value: '12', icon: 'search' as const },
  { label: 'Data Analyzed Today', value: '2.3 TB', icon: 'data' as const },
];

export const workflowSteps = [
  {
    label: 'Your Question',
    sub: 'Describe your issue',
    icon: 'question' as const,
    theme: 'question' as const,
  },
  {
    label: 'Data Quality Intelligence',
    sub: 'Synthesize & Score',
    icon: 'dataQuality' as const,
    theme: 'dataQuality' as const,
  },
  {
    label: 'BAU Intelligence',
    sub: 'Monitor Operations',
    icon: 'bau' as const,
    theme: 'bau' as const,
  },
  {
    label: 'Ticket Intelligence',
    sub: 'Analyze & Understand',
    icon: 'ticket' as const,
    theme: 'ticket' as const,
  },
  {
    label: 'Data Intelligence',
    sub: 'Find Root Cause',
    icon: 'data' as const,
    theme: 'data' as const,
  },
  {
    label: 'Impact Intelligence',
    sub: 'Assess Impact',
    icon: 'impact' as const,
    theme: 'impact' as const,
  },
  {
    label: 'Knowledge Intelligence',
    sub: 'Find Best Answers',
    icon: 'knowledge' as const,
    theme: 'knowledge' as const,
  },
  {
    label: 'Suggested Solution',
    sub: 'AI-Powered Resolution',
    icon: 'resolution' as const,
    theme: 'resolution' as const,
  },
];
