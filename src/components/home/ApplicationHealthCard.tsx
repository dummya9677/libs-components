import { ArrowRight } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useGetApplicationHealthQuery } from '../../services/api/applicationHealthApi';
import type {
  ApplicationHealthSegment,
  ApplicationHealthSummary,
} from '../../types/applicationHealth';
import { cn } from '../../utils/cn';
import { DashboardPanel } from './DashboardPanel';

const segmentMeta: Record<
  ApplicationHealthSegment['status'],
  { label: string; color: string; dotClass: string }
> = {
  healthy: {
    label: 'Healthy',
    color: '#22c55e',
    dotClass: 'bg-status-success',
  },
  warning: {
    label: 'Warning',
    color: '#f59e0b',
    dotClass: 'bg-status-warning',
  },
  critical: {
    label: 'Critical',
    color: '#ef4444',
    dotClass: 'bg-status-danger',
  },
  unknown: {
    label: 'Unknown',
    color: '#94a3b8',
    dotClass: 'bg-ink-muted',
  },
};

const legendOrder: ApplicationHealthSegment['status'][] = [
  'healthy',
  'warning',
  'critical',
  'unknown',
];

function toChartSegments(
  summary: ApplicationHealthSummary,
): ApplicationHealthSegment[] {
  return legendOrder
    .map((status) => ({
      status,
      label: segmentMeta[status].label,
      value: summary[status],
      color: segmentMeta[status].color,
    }))
    .filter((segment) => segment.value > 0);
}

function getLegendValue(
  summary: ApplicationHealthSummary,
  status: ApplicationHealthSegment['status'],
) {
  return summary[status];
}

export function ApplicationHealthCard({ className }: { className?: string }) {
  const { data, isLoading, isError } = useGetApplicationHealthQuery();

  if (isLoading) {
    return (
      <DashboardPanel title="Application Health" className={cn('min-w-0', className)}>
        <div className="flex min-h-[148px] items-center justify-center text-[10px] text-ink-muted">
          Loading application health…
        </div>
      </DashboardPanel>
    );
  }

  if (isError || !data) {
    return (
      <DashboardPanel title="Application Health" className={cn('min-w-0', className)}>
        <div className="flex min-h-[148px] items-center justify-center text-[10px] text-status-danger">
          Unable to load application health.
        </div>
      </DashboardPanel>
    );
  }

  const segments = toChartSegments(data);

  return (
    <DashboardPanel title="Application Health" className={cn('min-w-0', className)}>
      <div className="flex min-w-0 flex-col items-center gap-3">
        <div className="relative h-[112px] w-[112px] shrink-0 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="88%"
                strokeWidth={0}
                paddingAngle={segments.length > 1 ? 2 : 0}
              >
                {segments.map((segment) => (
                  <Cell key={segment.status} fill={segment.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold leading-none text-ink sm:text-2xl">
              {data.healthyPercent}%
            </span>
            <span className="mt-0.5 text-[10px] text-ink-muted">Healthy</span>
          </div>
        </div>

        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-1.5">
          {legendOrder.map((status) => (
            <li
              key={status}
              className="flex items-center gap-2 text-[10px] sm:text-[11px]"
            >
              <span
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  segmentMeta[status].dotClass,
                )}
              />
              <span className="font-medium text-ink">
                {segmentMeta[status].label}
              </span>
              <span className="tabular-nums text-ink-muted">
                ({getLegendValue(data, status)})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-client-cyan-helix-light transition hover:text-client-blue-helix-dark hover:underline sm:text-[11px]"
      >
        See all applications
        <ArrowRight className="h-3 w-3" strokeWidth={2} />
      </button>
    </DashboardPanel>
  );
}
