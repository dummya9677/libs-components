import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function DashboardPanel({
  title,
  children,
  className,
  onViewAll,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  onViewAll?: () => void;
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-lg border border-app-border bg-surface p-3 shadow-card',
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-ink sm:text-sm">{title}</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[10px] font-semibold text-client-cyan-helix-light transition hover:text-client-blue-helix-dark hover:underline"
        >
          View all
        </button>
      </div>
      {children}
    </div>
  );
}
