import { ChevronDown, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useGetAgentsQuery } from '../../services/api/agentsApi';
import { useAuth } from '../../hooks/useAuth';
import {
  EMPTY_AGENT_ACCESS_LIST,
  findApplicationById,
  getApplicationsForDropdown,
} from '../../utils/applicationAgents';
import { cn } from '../../utils/cn';

interface ApplicationSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  /** When set, only companies with this agent available are listed. */
  agentSlug?: string;
}

export function ApplicationSelect({
  value,
  onChange,
  className,
  disabled = false,
  id = 'application-select',
  agentSlug,
}: ApplicationSelectProps) {
  const { isAuthenticated } = useAuth();
  const { data: agentsData, isLoading, isError } = useGetAgentsQuery(
    undefined,
    { skip: !isAuthenticated },
  );
  const agents = agentsData ?? EMPTY_AGENT_ACCESS_LIST;

  const applications = useMemo(
    () => getApplicationsForDropdown(agents, agentSlug),
    [agents, agentSlug],
  );

  const selectedApplication = value
    ? findApplicationById(applications, value)
    : undefined;
  const selectValue = selectedApplication?.id ?? '';
  const emptyLabel = agentSlug
    ? 'No applications available for this agent'
    : 'No applications available';

  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="sr-only">
        Application
      </label>
      <div className="relative">
        <select
          id={id}
          value={selectValue}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled || isLoading || applications.length === 0}
          className={cn(
            'w-full appearance-none truncate rounded-lg border border-app-border bg-surface py-2 pl-3 pr-8 text-xs font-medium text-ink shadow-card transition sm:text-sm',
            'focus:border-client-cyan-helix-light focus:outline-none focus:ring-2 focus:ring-client-cyan-30/40',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          <option value="">
            {isLoading
              ? 'Loading applications…'
              : applications.length === 0
                ? emptyLabel
                : 'Select application'}
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
          Could not load applications from the agents list.
        </p>
      ) : null}
    </div>
  );
}
