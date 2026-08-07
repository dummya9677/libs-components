import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  Database,
  Info,
  Search,
  TrendingUp,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { aiInsights, intelligenceStats } from '../../data/homeDashboard';
import { env } from '../../utils/env';
import { cn } from '../../utils/cn';

const insightIcons = {
  warning: AlertTriangle,
  info: Info,
  cost: CircleDollarSign,
  success: CheckCircle2,
};

const insightStyles = {
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-client-cyan-10 text-client-cyan-helix-light',
  cost: 'bg-violet-50 text-violet-600',
  success: 'bg-status-success-soft text-emerald-600',
};

const statIcons = {
  bot: Bot,
  trend: TrendingUp,
  search: Search,
  data: Database,
};

export function HomeInsightsCards({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <DashboardCard
        title="Today's AI Insights"
        action={
          <span className="text-[9px] font-medium text-ink-muted">Updated 5 min ago</span>
        }
      >
        <ul className="space-y-1.5">
          {aiInsights.map((insight) => {
            const Icon = insightIcons[insight.type];
            return (
              <li
                key={insight.id}
                className="flex gap-2 rounded-lg border border-app-border-light bg-surface px-2 py-1.5"
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                    insightStyles[insight.type],
                  )}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold leading-snug text-ink">
                    {insight.title}
                  </p>
                  <p className="mt-0.5 text-[9px] leading-snug text-ink-muted">
                    {insight.subtitle}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="mt-2 text-[10px] font-semibold text-client-cyan-helix-light hover:underline"
        >
          View all insights →
        </button>
      </DashboardCard>

      <DashboardCard
        title={`${env.appName} Intelligence`}
        action={
          <span className="flex items-center gap-1 text-[9px] font-medium text-status-success">
            <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
            Live
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2">
          {intelligenceStats.map((stat) => {
            const Icon = statIcons[stat.icon];
            return (
              <div
                key={stat.label}
                className="rounded-lg border border-app-border-light bg-client-cyan-10/40 px-2 py-1.5"
              >
                <div className="mb-1 flex items-center gap-1">
                  <Icon className="h-3 w-3 text-client-cyan-helix-light" strokeWidth={1.75} />
                  <p className="text-sm font-bold leading-none text-ink">{stat.value}</p>
                </div>
                <p className="text-[8px] leading-tight text-ink-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </DashboardCard>
    </div>
  );
}

function DashboardCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-app-border bg-surface p-2.5 shadow-card">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-[11px] font-semibold text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
