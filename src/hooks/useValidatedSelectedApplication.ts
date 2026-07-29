import { useEffect } from 'react';
import { useGetApplicationsQuery } from '../services/api/applicationsApi';
import { findApplicationById } from '../utils/applicationAgents';
import { useSelectedApplication } from './useSelectedApplication';

/**
 * Keeps application selection in sync with GET /applications.
 * Clears stale sessionStorage values that are not in the API response.
 */
export function useValidatedSelectedApplication() {
  const selection = useSelectedApplication();
  const { data: applications = [], isLoading, isFetching } =
    useGetApplicationsQuery();

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
  };
}
