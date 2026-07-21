export type ApplicationHealthStatus =
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'unknown';

export interface ApplicationHealthSummary {
  healthyPercent: number;
  healthy: number;
  warning: number;
  critical: number;
  unknown: number;
  totalApplications: number;
}

export interface ApplicationHealthSegment {
  status: ApplicationHealthStatus;
  label: string;
  value: number;
  color: string;
}
