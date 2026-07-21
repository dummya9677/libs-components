import { Check } from 'lucide-react';
import { recentInvestigations } from '../../data/homeDashboard';
import { cn } from '../../utils/cn';
import { DashboardPanel } from './DashboardPanel';

const investigationIconStyles = {
  ticket: 'bg-[#7C3AED]',
  finance: 'bg-[#10B981]',
} as const;

export function RecentInvestigationsCard({ className }: { className?: string }) {
  return (
    <DashboardPanel title="Recent Investigations" className={className}>
      <ul className="divide-y divide-app-border-light">
        {recentInvestigations.map((item) => (
          <li key={item.id} className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0">
            <span
              className={cn(
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white',
                investigationIconStyles[item.variant],
              )}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium leading-snug text-ink">
                {item.title}
              </p>
              <p className="mt-0.5 text-[10px] text-ink-muted">
                {item.ref} • {item.status}
              </p>
            </div>
            <span className="shrink-0 text-[10px] text-ink-muted">{item.time}</span>
          </li>
        ))}
      </ul>
    </DashboardPanel>
  );
}
