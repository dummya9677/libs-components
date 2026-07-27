import costIntelligence from './costintelligence.png';
import dataIssueAnalyzer from './data-issue-analyzer.png';
import dqIntelligence from './dqintelligence.png';
import impactAnalyzer from './impact-analyzer.png';
import knowledgeAssistant from './knowledge-assistant.png';
import ticketAnalyzer from './ticket-analyzer.png';

const agentHeroImages: Record<string, string> = {
  'data-quality-intelligence': dqIntelligence,
  'ticket-intelligence': ticketAnalyzer,
  'data-intelligence': dataIssueAnalyzer,
  'impact-intelligence': impactAnalyzer,
  'knowledge-intelligence': knowledgeAssistant,
  'cost-intelligence': costIntelligence,
};

export function getAgentHeroImage(slug: string): string | undefined {
  return agentHeroImages[slug];
}
