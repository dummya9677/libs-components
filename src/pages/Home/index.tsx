import {
  ArrowRight,
  BookOpen,
  CircleDollarSign,
  Database,
  Menu,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationHealthCard } from '../../components/home/ApplicationHealthCard';
import { HowItWorksSection } from '../../components/home/HowItWorksSection';
import { HomeRightRail } from '../../components/home/HomeRightRail';
import { RecentInvestigationsCard } from '../../components/home/RecentInvestigationsCard';
import { RecommendedActionsCard } from '../../components/home/RecommendedActionsCard';
import { agents, DEFAULT_AGENT_SLUG, getAgentTheme } from '../../data/agents';
import {
  comingSoonAgents,
  homeKpis,
  suggestedQueries,
} from '../../data/homeDashboard';
import { PromptComposer } from '../../components/chat/PromptComposer';
import { ApplicationSelect } from '../../components/application/ApplicationSelect';
import { TopStatusBar } from '../../components/layout/TopStatusBar';
import { clientBrandCardGradient } from '../../config/clientColors';
import { useAuth } from '../../hooks/useAuth';
import { useLayout } from '../../hooks/useLayout';
import { useSelectedApplication } from '../../hooks/useSelectedApplication';
import { env } from '../../utils/env';
import { cn } from '../../utils/cn';

const agentIcons: Record<string, typeof Ticket> = {
  'data-quality-intelligence': ShieldCheck,
  'ticket-intelligence': Ticket,
  'data-intelligence': Database,
  'impact-intelligence': Network,
  'knowledge-intelligence': BookOpen,
  'cost-intelligence': CircleDollarSign,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function HomePage() {
  const { user } = useAuth();
  const { toggleSidebar } = useLayout();
  const { applicationName, setApplicationName } = useSelectedApplication();
  const navigate = useNavigate();
  const [homePromptError, setHomePromptError] = useState<string | null>(null);
  const firstName = user?.name?.split(' ')[0] ?? 'John';

  const openAgent = (slug: string, prompt?: string) => {
    if (!applicationName) {
      setHomePromptError('Select an application before continuing.');
      return;
    }

    setHomePromptError(null);
    navigate(`/assistant/${slug}`, {
      state: prompt?.trim() ? { initialPrompt: prompt.trim() } : undefined,
    });
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-app-bg">
      <header className="relative z-50 shrink-0 border-b border-app-border/60 bg-surface/80 px-3 py-2.5 backdrop-blur-sm sm:px-4 lg:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <button
              type="button"
              onClick={toggleSidebar}
              className="relative z-[120] mt-0.5 rounded-lg p-1.5 text-ink-secondary hover:bg-surface-muted lg:z-auto lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold tracking-tight text-ink sm:text-lg">
              {getGreeting()}, {firstName}! 👋
            </h1>
          </div>
          <TopStatusBar />
        </div>

        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold sm:text-base">
              <span className="text-ink-secondary">Welcome to the </span>
              <span className="text-client-primary">{env.appName}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-ink-secondary sm:text-xs">
              The AI platform for intelligent application support.
            </p>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin lg:shrink-0">
            {homeKpis.map((kpi) => (
              <div
                key={kpi.label}
                className="min-w-[108px] shrink-0 rounded-lg border border-app-border bg-surface px-2.5 py-1.5 shadow-card"
              >
                <p className="text-[9px] font-medium text-ink-muted">{kpi.label}</p>
                <p className="text-xs font-bold text-ink">{kpi.value}</p>
                <p
                  className={cn(
                    'text-[9px]',
                    kpi.positive ? 'text-status-success' : 'text-status-danger',
                  )}
                >
                  {kpi.delta}
                </p>
              </div>
            ))}
          </div>
        </div>

      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 scrollbar-thin sm:px-4 lg:px-5">
          <section>
            <div
              className="rounded-xl p-2.5 shadow-card sm:p-3"
              style={{ background: clientBrandCardGradient }}
            >
                <p className="mb-1.5 text-left text-[11px] font-semibold sm:text-xs">
                  <span className="text-client-cyan-helix-light">Ask anything.</span>{' '}
                  <span className="text-client-blue-helix-dark">
                    {env.appName} will handle the rest.
                  </span>
                </p>
                <ApplicationSelect
                  id="home-application-select"
                  value={applicationName}
                  onChange={(value) => {
                    setApplicationName(value);
                    if (value) setHomePromptError(null);
                  }}
                  className="mb-2"
                />
                <PromptComposer
                  placeholder={
                    applicationName
                      ? 'Ask anything about tickets, data issues, impact, knowledge...'
                      : 'Select an application above to ask a question…'
                  }
                  toolbar="main"
                  gradientBorder={false}
                  disabled={!applicationName}
                  onSend={(text) => openAgent(DEFAULT_AGENT_SLUG, text)}
                />
                {homePromptError ? (
                  <p className="mt-1.5 text-[10px] text-status-danger" role="alert">
                    {homePromptError}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap justify-start gap-1">
                {suggestedQueries.map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => openAgent(DEFAULT_AGENT_SLUG, query)}
                    className="rounded-full border border-white/80 bg-white/70 px-2 py-0.5 text-[9px] font-medium text-client-blue-helix-dark transition hover:border-client-cyan-helix-light/40 hover:bg-white hover:text-client-cyan-helix-light sm:text-[10px]"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-xs font-semibold text-ink sm:text-sm">AI Agents</h2>
              <span className="text-[10px] text-ink-muted">6 agents available</span>
            </div>
            <div className="grid gap-2 lg:grid-cols-[1fr_108px]">
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-3">
                {agents.map((agent) => {
                  const theme = getAgentTheme(agent.colorKey);
                  const Icon = agentIcons[agent.slug] ?? Sparkles;
                  return (
                    <article
                      key={agent.id}
                      className="flex flex-col rounded-lg border border-app-border bg-surface p-2 shadow-card transition hover:shadow-md"
                      style={{
                        background: `linear-gradient(155deg, ${theme.gradientFrom} 0%, #ffffff 70%)`,
                      }}
                    >
                      <div className="flex items-start gap-1.5">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white"
                          style={{ backgroundColor: theme.heroIcon }}
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
                      <button
                        type="button"
                        onClick={() => openAgent(agent.slug)}
                        className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold text-client-cyan-helix-light hover:underline"
                      >
                        Open
                        <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </article>
                  );
                })}
              </div>

              <aside className="hidden flex-col items-center rounded-lg border border-dashed border-app-border bg-surface-muted/50 p-2 text-center lg:flex">
                <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-client-cyan-10 text-client-blue-helix-dark">
                  <Rocket className="h-2.5 w-2.5" strokeWidth={2} />
                </div>
                <p className="text-[9px] font-semibold uppercase leading-tight tracking-wide text-ink-muted">
                  More Coming Soon
                </p>
                <ul className="mt-1.5 w-full space-y-1">
                  {comingSoonAgents.map((name) => (
                    <li key={name} className="text-[9px] leading-snug text-ink-secondary">
                      {name}
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </section>

          <HowItWorksSection />

          <section className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <RecentInvestigationsCard />
            <RecommendedActionsCard />
            <ApplicationHealthCard className="md:col-span-2 xl:col-span-1" />
          </section>
        </main>

        <div className="hidden min-h-0 lg:flex">
          <HomeRightRail />
        </div>
      </div>
    </div>
  );
}
