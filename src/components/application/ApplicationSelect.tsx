import { ChevronDown, Loader2 } from 'lucide-react';
import { useGetApplicationsQuery } from '../../services/api/applicationsApi';
import { cn } from '../../utils/cn';

interface ApplicationSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Compact style for chat header */
  variant?: 'default' | 'compact';
  disabled?: boolean;
  id?: string;
}

export function ApplicationSelect({
  value,
  onChange,
  className,
  variant = 'default',
  disabled = false,
  id = 'application-select',
}: ApplicationSelectProps) {
  const { data: applications = [], isLoading, isError } = useGetApplicationsQuery();

  const isCompact = variant === 'compact';

  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="sr-only">
        Application
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled || isLoading}
          className={cn(
            'w-full appearance-none truncate rounded-lg border border-app-border bg-surface pr-8 font-medium text-ink shadow-card transition',
            'focus:border-client-cyan-helix-light focus:outline-none focus:ring-2 focus:ring-client-cyan-30/40',
            'disabled:cursor-not-allowed disabled:opacity-60',
            isCompact
              ? 'py-1.5 pl-2.5 text-[11px] sm:max-w-[180px]'
              : 'py-2 pl-3 text-xs sm:text-sm',
          )}
        >
          <option value="">
            {isLoading ? 'Loading applications…' : 'Select application'}
          </option>
          {applications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-ink-muted">
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
          )}
        </span>
      </div>
      {isError ? (
        <p className="mt-1 text-[10px] text-status-danger" role="alert">
          Could not load applications. Check{' '}
          <code className="text-[9px]">VITE_API_APPLICATIONS_PATH</code>.
        </p>
      ) : null}
    </div>
  );
}
