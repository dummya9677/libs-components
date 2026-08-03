import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Briefcase,
  CircleDollarSign,
  Database,
  Network,
  ShieldCheck,
  Sparkles,
  Ticket,
} from 'lucide-react';
import type { AgentColorKey } from '../config/colors';
import type { AgentDefinition } from '../data/agents';

const agentIconsBySlug: Record<string, LucideIcon> = {
  'data-quality-intelligence': ShieldCheck,
  'bau-intelligence': Briefcase,
  'ticket-intelligence': Ticket,
  'data-intelligence': Database,
  'impact-intelligence': Network,
  'knowledge-intelligence': BookOpen,
  'cost-intelligence': CircleDollarSign,
};

const agentIconsByColorKey: Record<AgentColorKey, LucideIcon> = {
  dataQuality: ShieldCheck,
  bau: Briefcase,
  ticket: Sparkles,
  dataIssue: Database,
  impact: Network,
  knowledge: BookOpen,
  cost: CircleDollarSign,
};

export function getAgentLucideIcon(agent: AgentDefinition): LucideIcon {
  return agentIconsBySlug[agent.slug] ?? agentIconsByColorKey[agent.colorKey] ?? Database;
}

export function getAgentLucideIconBySlug(slug: string): LucideIcon {
  return agentIconsBySlug[slug] ?? Database;
}
