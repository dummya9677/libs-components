import { useEffect, useMemo } from 'react';
import { useGetAgentsQuery } from '../services/api/agentsApi';
import {
  findApplicationById,
  getApplicationsForDropdown,
} from '../utils/applicationAgents';
import { useAuth } from './useAuth';
import { useSelectedApplication } from './useSelectedApplication';

/**
 * Keeps application selection in sync with GET /agents.
 * Clears stale sessionStorage values that are not in the API response.
 */
export function useValidatedSelectedApplication(agentSlug?: string) {
  const { isAuthenticated } = useAuth();
  const selection = useSelectedApplication();
  const { data: agents = [], isLoading, isFetching } = useGetAgentsQuery(
    undefined,
    { skip: !isAuthenticated },
  );

  const applications = useMemo(
    () => getApplicationsForDropdown(agents, agentSlug),
    [agents, agentSlug],
  );

  const isResolvingApplications = isLoading || isFetching;
  const validApplication = selection.applicationName
    ? findApplicationById(applications, selection.applicationName)
    : undefined;

  const requiresApplicationSelection =
    !selection.applicationName ||
    (!isResolvingApplications && !validApplication);

  const applicationName =
    validApplication?.id ??
    (isResolvingApplications ? selection.applicationName : '');

  useEffect(() => {
    if (!selection.applicationName || isResolvingApplications) return;

    if (!validApplication) {
      selection.clearApplicationName();
    }
  }, [
    isResolvingApplications,
    selection.applicationName,
    selection.clearApplicationName,
    validApplication,
  ]);

  return {
    ...selection,
    applicationName,
    hasApplication: Boolean(applicationName),
    requiresApplicationSelection,
    validApplication,
    applications,
    isResolvingApplications,
  };
}
