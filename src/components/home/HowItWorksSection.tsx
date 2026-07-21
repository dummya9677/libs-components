import {
  BookOpen,
  Bot,
  ChevronRight,
  Crosshair,
  Database,
  MessageCircle,
  Rocket,
  Ticket,
  type LucideIcon,
} from 'lucide-react';
import { colors } from '../../config/colors';
import { workflowSteps } from '../../data/homeDashboard';
import { env } from '../../utils/env';
import { cn } from '../../utils/cn';

type WorkflowIconKey =
  | 'question'
  | 'ticket'
  | 'impact'
  | 'data'
  | 'knowledge'
  | 'resolution';

type WorkflowThemeKey =
  | 'question'
  | 'ticket'
  | 'impact'
  | 'data'
  | 'knowledge'
  | 'resolution';

const workflowIcons: Record<WorkflowIconKey, LucideIcon> = {
  question: MessageCircle,
  ticket: Ticket,
  impact: Crosshair,
  data: Database,
  knowledge: BookOpen,
  resolution: Rocket,
};

const workflowThemeStyles: Record<
  WorkflowThemeKey,
  { gradientFrom: string; primary: string; heroIcon: string; iconClass?: string }
> = {
  question: {
    gradientFrom: colors.brandSoft,
    primary: colors.brandDark,
    heroIcon: colors.brand,
  },
  ticket: {
    gradientFrom: colors.agents.ticket.gradientFrom,
    primary: colors.agents.ticket.primary,
    heroIcon: colors.agents.ticket.heroIcon,
  },
  impact: {
    gradientFrom: colors.agents.impact.gradientFrom,
    primary: colors.agents.impact.primary,
    heroIcon: colors.agents.impact.heroIcon,
  },
  data: {
    gradientFrom: '#DBEAFE',
    primary: '#2563EB',
    heroIcon: '#2563EB',
  },
  knowledge: {
    gradientFrom: colors.agents.knowledge.gradientFrom,
    primary: colors.agents.knowledge.primary,
    heroIcon: colors.agents.knowledge.heroIcon,
  },
  resolution: {
    gradientFrom: '#ECFCCB',
    primary: '#65A30D',
    heroIcon: '#65A30D',
    iconClass: '-rotate-12',
  },
};

function WorkflowConnector() {
  return (
    <div className="flex shrink-0 items-center justify-center self-center px-0.5">
      <div className="flex items-center">
        <div className="w-2 border-t border-dashed border-ink-muted/35 sm:w-2.5" />
        <ChevronRight
          className="h-3 w-3 shrink-0 text-ink-muted/45"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="mt-3 rounded-xl border border-app-border bg-surface p-3 shadow-card sm:p-4">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h2 className="text-xs font-bold text-client-blue-helix-dark sm:text-sm">
          How {env.appName} Works
        </h2>
        <p className="text-[10px] text-ink-muted sm:text-[11px]">
          Multi-agent orchestration for intelligent resolution
        </p>
      </div>

      <div className="flex w-full items-stretch">
        {workflowSteps.map((step, index) => {
          const Icon = workflowIcons[step.icon];
          const theme = workflowThemeStyles[step.theme];

          return (
            <div key={step.label} className="contents">
              <article
                className="flex min-h-[88px] min-w-0 flex-1 flex-col items-center rounded-lg border border-app-border bg-surface p-2 text-center shadow-card"
                style={{
                  background: `linear-gradient(155deg, ${theme.gradientFrom} 0%, #ffffff 70%)`,
                }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: theme.heroIcon }}
                >
                  <Icon
                    className={cn('h-3.5 w-3.5', theme.iconClass)}
                    strokeWidth={1.75}
                  />
                </div>
                <h3
                  className="mt-1.5 line-clamp-2 text-[9px] font-semibold leading-tight sm:text-[10px]"
                  style={{ color: theme.primary }}
                >
                  {step.label}
                </h3>
                <p className="mt-0.5 min-h-[20px] line-clamp-2 text-[8px] leading-snug text-ink-secondary sm:text-[9px]">
                  {step.sub || '\u00A0'}
                </p>
              </article>

              {index < workflowSteps.length - 1 ? <WorkflowConnector /> : null}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 sm:gap-3">
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] font-medium text-client-cyan-helix-light sm:text-[10px]">
            Processing...
          </span>
          <span className="hidden text-[9px] text-ink-muted sm:inline sm:text-[10px]">
            Agents Working
          </span>
          <div className="flex -space-x-1">
            {[0, 1, 2].map((agent) => (
              <span
                key={agent}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-client-cyan-10 text-client-cyan-helix-light ring-2 ring-white sm:h-6 sm:w-6"
              >
                <Bot className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={2} />
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted sm:h-2">
            <div className="h-full w-[78%] rounded-full bg-client-cyan-helix-light" />
          </div>
        </div>

        <span className="shrink-0 text-[9px] text-ink-muted sm:text-[10px]">
          78% Complete
        </span>
      </div>
    </section>
  );
}
