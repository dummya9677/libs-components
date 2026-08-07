import {
  ArrowLeft,
  Play,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAgentHeroImage } from '../../assets/agentHeroImages';
import type { AgentDefinition } from '../../data/agents';
import { getAgentTheme } from '../../data/agents';
import { AgentIcon } from '../icons/AgentIcon';
import { CapabilityIcon } from '../icons/CapabilityIcon';
import { FeatureCard } from './FeatureCard';
import { ApplicationSelect } from '../application/ApplicationSelect';
import { ApplicationRequiredNotice } from '../application/ApplicationRequiredNotice';
import { cn } from '../../utils/cn';

function HeroArt({
  agent,
}: {
  agent: AgentDefinition;
}) {
  const imageUrl = getAgentHeroImage(agent.slug);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${agent.name} illustration`}
        className="hidden h-24 w-32 shrink-0 object-contain object-bottom-right md:block lg:h-28 lg:w-36"
      />
    );
  }

  const variant = agent.heroVariant;

  if (variant === 'book') {
    return (
      <div className="relative hidden h-20 w-28 shrink-0 items-center justify-center md:flex lg:h-24 lg:w-36">
        <div className="h-14 w-20 -rotate-6 rounded-lg bg-white/50 shadow-card" />
        <div className="absolute h-14 w-20 rotate-6 rounded-lg bg-white/90 shadow-md" />
      </div>
    );
  }
  if (variant === 'glass') {
    return (
      <div className="relative hidden h-20 w-28 md:block lg:h-24 lg:w-36">
        <div className="absolute left-1 top-3 h-12 w-9 -rotate-12 rounded-xl bg-white/40 shadow-card" />
        <div className="absolute left-9 top-1 h-14 w-10 rotate-6 rounded-xl bg-white/70 shadow-md" />
        <div className="absolute right-1 top-4 h-10 w-9 rotate-[14deg] rounded-xl bg-white/50" />
      </div>
    );
  }
  if (variant === 'database') {
    return (
      <div className="relative hidden h-20 w-28 md:block lg:h-24 lg:w-32">
        <div className="absolute inset-x-5 top-3 h-12 rounded-full bg-white/70 shadow-card" />
        <div className="absolute inset-x-7 top-6 h-10 rounded-full bg-white shadow-md" />
      </div>
    );
  }
  if (variant === 'quality') {
    return (
      <div className="relative hidden h-20 w-28 md:block lg:h-24 lg:w-32">
        <div className="absolute inset-x-4 top-4 h-10 rounded-lg bg-white/60 shadow-card" />
        <div className="absolute inset-x-6 top-7 h-8 rounded-md bg-white shadow-md" />
        <div className="absolute right-3 top-2 h-6 w-6 rounded-full bg-white/80" />
      </div>
    );
  }
  if (variant === 'cost') {
    return (
      <div className="relative hidden h-20 w-28 md:block lg:h-24 lg:w-32">
        <div className="absolute left-4 top-5 h-10 w-10 rounded-full bg-white/70 shadow-card" />
        <div className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/50" />
        <div className="absolute bottom-3 left-8 h-7 w-7 rounded-full bg-white/90 shadow-md" />
      </div>
    );
  }
  if (variant === 'bau') {
    return (
      <div className="relative hidden h-20 w-28 md:block lg:h-24 lg:w-32">
        <div className="absolute left-5 top-4 h-10 w-12 rounded-lg bg-white/60 shadow-card" />
        <div className="absolute right-4 top-6 h-8 w-10 rounded-md bg-white/90 shadow-md" />
        <div className="absolute bottom-3 left-8 h-5 w-14 rounded-full bg-white/50" />
      </div>
    );
  }
  return (
    <div className="relative hidden h-20 w-28 md:block lg:h-24 lg:w-32">
      <div className="absolute left-3 top-4 h-8 w-8 rotate-12 rounded-lg bg-white/50" />
      <div className="absolute left-10 top-2 h-9 w-9 -rotate-6 rounded-lg bg-white/70 shadow-card" />
    </div>
  );
}

interface AgentWorkspaceProps {
  agent: AgentDefinition;
  onPrompt?: (value: string) => void;
  applicationName: string;
  onApplicationChange: (value: string) => void;
  selectedApplicationName?: string;
}

export function AgentWorkspace({
  agent,
  onPrompt,
  applicationName,
  onApplicationChange,
  selectedApplicationName,
}: AgentWorkspaceProps) {
  const navigate = useNavigate();
  const theme = getAgentTheme(agent.colorKey);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-app-bg">
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 pb-5 pt-1 scrollbar-thin sm:px-5 lg:px-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand transition hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to homepage
        </button>

        <section
          className="mt-3 overflow-hidden rounded-xl border border-app-border p-3 shadow-card sm:rounded-2xl sm:p-4"
          style={{
            background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 55%, #ffffff 100%)`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <AgentIcon agent={agent} size="lg" shape="rounded" />
                <h2
                  className="text-lg font-bold leading-tight sm:text-xl"
                  style={{ color: theme.primary }}
                >
                  {agent.name}
                </h2>
              </div>
              <p className="mt-1.5 max-w-xl text-xs text-ink-secondary sm:text-sm">
                {agent.description}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap.label}
                    className="inline-flex items-center gap-1 rounded-full border bg-white/80 px-2.5 py-1 text-[10px] font-medium sm:text-[11px]"
                    style={{
                      borderColor: `${theme.chip}40`,
                      color: theme.chip,
                    }}
                  >
                    <CapabilityIcon name={cap.icon} className="h-3 w-3" />
                    {cap.label}
                  </span>
                ))}
              </div>
            </div>
            <HeroArt agent={agent} />
          </div>
        </section>

        <section
          aria-label="Application selection"
          className="mt-3 rounded-xl border border-app-border bg-surface px-3.5 py-3.5 shadow-card sm:px-4 sm:py-4"
        >
          <h3 className="mb-3 text-xs font-semibold text-ink sm:text-sm">
            Application
          </h3>
          <ApplicationSelect
            id="workspace-application-select"
            value={applicationName}
            onChange={onApplicationChange}
            className="w-full max-w-md"
            agentSlug={agent.slug}
          />
          <div className="mt-2.5">
            {!applicationName ? (
              <ApplicationRequiredNotice variant="plain" className="mb-0" />
            ) : (
              <p className="flex items-start gap-2 text-xs leading-snug text-ink-secondary sm:text-[13px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-status-success" />
                <span>
                  Working with{' '}
                  <span className="font-semibold text-ink">
                    {selectedApplicationName ?? applicationName}
                  </span>
                  . Use the chat panel or quick actions below.
                </span>
              </p>
            )}
          </div>
        </section>

        <section className="mt-3 sm:mt-4">
          <h3 className="mb-2 text-xs font-semibold text-ink sm:text-sm">
            What can I help you with?
          </h3>
          <div
            className={cn(
              'grid gap-2.5',
              agent.actions.length <= 3
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4',
            )}
          >
            {agent.actions.map((action) => (
              <FeatureCard
                key={action.id}
                action={action}
                onClick={() => onPrompt?.(action.title)}
              />
            ))}
          </div>
        </section>

        <section className="mt-3 sm:mt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold text-ink sm:text-sm">
              Try these examples
            </h3>
            <button
              type="button"
              className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-muted"
              aria-label="Refresh examples"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {agent.examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => onPrompt?.(example)}
                className="rounded-lg bg-brand-soft px-2.5 py-1.5 text-left text-[11px] font-medium text-brand transition hover:bg-brand/10 sm:px-3 sm:py-2 sm:text-xs"
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 flex flex-col items-start justify-between gap-2.5 rounded-xl bg-banner px-3.5 py-3 sm:mt-6 sm:flex-row sm:items-center sm:rounded-2xl sm:px-5 sm:py-3.5">
          <div>
            <p className="text-xs font-semibold text-banner-text sm:text-sm">
              One question. Multi-agent intelligence.
            </p>
            <p className="mt-0.5 text-[11px] text-ink-secondary sm:text-xs">
              Our AI agents work together to understand, analyze and resolve
              your issues faster.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-dark sm:px-4 sm:py-2 sm:text-xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            See how it works
          </button>
        </section>
      </div>
    </div>
  );
}
