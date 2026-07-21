import type { ApplicationHealthSummary } from '../types/applicationHealth';

/** Dummy payload — replace via GET /dashboard/application-health when API is ready. */
export const mockApplicationHealth: ApplicationHealthSummary = {
  healthyPercent: 96,
  healthy: 18,
  warning: 2,
  critical: 1,
  unknown: 0,
  totalApplications: 21,
};
