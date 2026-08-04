import { Clock } from 'lucide-react';
import type { AgentDefinition } from '../../data/agents';
import { getAgentTheme } from '../../data/agents';
import { getAgentLucideIconBySlug } from '../../utils/agentIcons';

export function ComingSoonIntelligenceCard({
  agent,
}: {
  agent: AgentDefinition;
}) {
  const theme = getAgentTheme(agent.colorKey);
  const Icon = getAgentLucideIconBySlug(agent.slug);

  return (
    <article
      className="flex flex-col rounded-lg border border-dashed border-app-border bg-surface p-2 shadow-card"
      style={{
        background: `linear-gradient(155deg, ${theme.gradientFrom} 0%, #ffffff 70%)`,
      }}
    >
      <div className="flex items-start gap-1.5">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
          style={{
            backgroundColor: theme.heroIcon,
            color: '#FFFFFF',
          }}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="text-[11px] font-semibold leading-tight"
            style={{ color: theme.primary }}
          >
            {agent.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-ink-secondary">
            {agent.description}
          </p>
        </div>
      </div>
      <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold text-ink-muted">
        <Clock className="h-2.5 w-2.5" strokeWidth={2} />
        Coming Soon
      </div>
    </article>
  );
}
