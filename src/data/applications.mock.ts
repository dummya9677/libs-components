import type { ApplicationOption } from '../types';

/** Demo list used when VITE_MOCK_AUTH=true — replace via GET applications API in production. */
export const mockApplications: ApplicationOption[] = [
  { label: 'Sales Portal', value: 'sales-portal' },
  { label: 'Customer 360', value: 'customer-360' },
  { label: 'Finance Dashboard', value: 'finance-dashboard' },
  { label: 'Supply Chain Hub', value: 'supply-chain-hub' },
];
