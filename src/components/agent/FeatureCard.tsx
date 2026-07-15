import {
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Search,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import type { AgentAction, FeatureAccent } from '../../data/agents';
import { cn } from '../../utils/cn';

const accentClass: Record<FeatureAccent, string> = {
  purple: 'bg-feature-purple/10 text-feature-purple',
  blue: 'bg-feature-blue/10 text-feature-blue',
  green: 'bg-feature-green/10 text-feature-green',
  orange: 'bg-feature-orange/10 text-feature-orange',
  yellow: 'bg-feature-yellow/15 text-feature-yellow',
  gold: 'bg-feature-gold/10 text-feature-gold',
};

const arrowClass: Record<FeatureAccent, string> = {
  purple: 'text-feature-purple',
  blue: 'text-feature-blue',
  green: 'text-feature-green',
  orange: 'text-feature-orange',
  yellow: 'text-feature-yellow',
  gold: 'text-feature-gold',
};

const iconByAccent: Record<FeatureAccent, LucideIcon> = {
  purple: AlertTriangle,
  blue: ShieldCheck,
  green: Search,
  orange: Activity,
  yellow: Activity,
  gold: ShieldCheck,
};

interface FeatureCardProps {
  action: AgentAction;
  onClick?: () => void;
}

export function FeatureCard({ action, onClick }: FeatureCardProps) {
  const Icon = iconByAccent[action.accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full flex-col rounded-xl border border-app-border bg-surface p-3 text-left shadow-card transition hover:border-brand/25 hover:shadow-md sm:p-3.5"
    >
      <div
        className={cn(
          'mb-2 flex h-8 w-8 items-center justify-center rounded-lg sm:mb-2.5 sm:h-9 sm:w-9 sm:rounded-xl',
          accentClass[action.accent],
        )}
      >
        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
      </div>
      <h3 className="text-xs font-semibold text-ink sm:text-[13px]">
        {action.title}
      </h3>
      <p className="mt-1 flex-1 text-[11px] leading-relaxed text-ink-secondary sm:text-xs">
        {action.description}
      </p>
      <span
        className={cn(
          'mt-2 inline-flex sm:mt-2.5',
          arrowClass[action.accent],
        )}
      >
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
      </span>
    </button>
  );
}
