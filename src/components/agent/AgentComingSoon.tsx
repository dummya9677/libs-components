import { ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AgentColorKey } from '../../config/colors';
import { getAgentTheme } from '../../data/agents';
import { TopStatusBar } from '../layout/TopStatusBar';
import { useLayout } from '../../hooks/useLayout';
import { getAgentLucideIconBySlug } from '../../utils/agentIcons';

interface AgentComingSoonProps {
  name: string;
  description: string;
  colorKey: AgentColorKey;
  slug?: string;
}

export function AgentComingSoon({
  name,
  description,
  colorKey,
  slug,
}: AgentComingSoonProps) {
  const navigate = useNavigate();
  const { toggleSidebar } = useLayout();
  const theme = getAgentTheme(colorKey);
  const Icon = getAgentLucideIconBySlug(slug ?? '');

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-app-bg">
      <header className="relative z-50 flex shrink-0 flex-wrap items-start justify-between gap-3 px-3 pb-1.5 pt-3 sm:px-5 sm:pt-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            className="relative z-[120] mt-0.5 rounded-lg p-1.5 text-ink-secondary hover:bg-surface-muted lg:z-auto lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:max-w-[360px] sm:shrink-0">
          <TopStatusBar />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-1.5 self-start text-xs font-medium text-brand transition hover:underline sm:mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to homepage
        </button>

        <div
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-app-border p-6 text-center shadow-card sm:p-8"
          style={{
            background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 55%, #ffffff 100%)`,
          }}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-card"
            style={{ backgroundColor: theme.heroIcon }}
          >
            <Icon className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h1
            className="mt-4 text-xl font-bold sm:text-2xl"
            style={{ color: theme.primary }}
          >
            {name}
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">{description}</p>
          <div className="mt-5 rounded-xl border border-app-border bg-white/80 px-4 py-3">
            <p className="text-sm font-semibold text-ink">Coming soon</p>
            <p className="mt-1 text-xs text-ink-secondary">
              We&apos;re building this capability. Check back soon or explore
              our other intelligence agents from the home page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-5 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Browse AI Agents
          </button>
        </div>
      </div>
    </div>
  );
}
