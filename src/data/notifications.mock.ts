import type { AppNotification } from '../types/notification';

/** Dummy notifications — served via RTK Query until API is wired. */
export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'ETL pipeline delay detected',
    message: 'Staging pipeline is 12 minutes behind schedule.',
    createdAt: new Date(Date.now() - 8 * 60_000).toISOString(),
    type: 'warning',
    read: false,
  },
  {
    id: 'n2',
    title: 'Ticket INC-1284 assigned to you',
    message: 'Impact Intelligence flagged a high-priority regression.',
    createdAt: new Date(Date.now() - 42 * 60_000).toISOString(),
    type: 'alert',
    read: false,
  },
  {
    id: 'n3',
    title: 'Weekly health report ready',
    message: 'Application health summary for last 7 days is available.',
    createdAt: new Date(Date.now() - 3 * 3_600_000).toISOString(),
    type: 'success',
    read: false,
  },
  {
    id: 'n4',
    title: 'New knowledge article published',
    message: 'Runbook updated for Salesforce connector timeouts.',
    createdAt: new Date(Date.now() - 6 * 3_600_000).toISOString(),
    type: 'info',
    read: true,
  },
];
