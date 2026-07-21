import {
  AlertTriangle,
  Circle,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { recommendedActions } from '../../data/homeDashboard';
import { cn } from '../../utils/cn';
import { DashboardPanel } from './DashboardPanel';

const priorityTextStyles = {
  High: 'text-status-danger',
  Medium: 'text-amber-600',
  Low: 'text-status-success',
} as const;

const actionIconConfig: Record<
  (typeof recommendedActions)[number]['icon'],
  { Icon: LucideIcon; className: string; strokeWidth?: number }
> = {
  alert: { Icon: AlertTriangle, className: 'text-status-danger' },
  schema: { Icon: FileText, className: 'text-amber-500' },
  optimize: { Icon: Circle, className: 'text-client-cyan-helix-light', strokeWidth: 1.75 },
  refresh: { Icon: Circle, className: 'text-status-success', strokeWidth: 1.75 },
  document: { Icon: FileText, className: 'text-client-cyan-helix-light' },
};

export function RecommendedActionsCard({ className }: { className?: string }) {
  return (
    <DashboardPanel title="Recommended Actions" className={className}>
      <ul className="divide-y divide-app-border-light">
        {recommendedActions.map((action) => {
          const { Icon, className: iconClassName, strokeWidth = 2 } =
            actionIconConfig[action.icon];

          return (
            <li
              key={action.id}
              className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0"
            >
              <Icon
                className={cn('h-4 w-4 shrink-0', iconClassName)}
                strokeWidth={strokeWidth}
              />
              <p className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-ink">
                {action.title}
              </p>
              <span
                className={cn(
                  'shrink-0 text-[10px] font-semibold',
                  priorityTextStyles[action.priority],
                )}
              >
                {action.priority}
              </span>
            </li>
          );
        })}
      </ul>
    </DashboardPanel>
  );
}
