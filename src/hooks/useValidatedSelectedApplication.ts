import { useEffect, useMemo } from 'react';
import { useGetAgentsQuery } from '../services/api/agentsApi';
import {
  EMPTY_AGENT_ACCESS_LIST,
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
  const { data: agentsData, isLoading } = useGetAgentsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const agents = agentsData ?? EMPTY_AGENT_ACCESS_LIST;

  const applications = useMemo(
    () => getApplicationsForDropdown(agents, agentSlug),
    [agents, agentSlug],
  );

  const validApplication = selection.applicationName
    ? findApplicationById(applications, selection.applicationName)
    : undefined;

  const requiresApplicationSelection =
    !selection.applicationName || (!isLoading && !validApplication);

  const applicationName =
    validApplication?.id ?? (isLoading ? selection.applicationName : '');

  useEffect(() => {
    if (!selection.applicationName || isLoading) return;

    if (!validApplication) {
      selection.clearApplicationName();
      return;
    }

    if (selection.applicationName !== validApplication.id) {
      selection.setApplicationName(validApplication.id);
    }
  }, [
    isLoading,
    selection.applicationName,
    selection.clearApplicationName,
    selection.setApplicationName,
    validApplication?.id,
  ]);

  return {
    ...selection,
    applicationName,
    hasApplication: Boolean(applicationName),
    requiresApplicationSelection,
    validApplication,
    applications,
    isResolvingApplications: isLoading,
  };
}
