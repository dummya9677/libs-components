import type { ApplicationWithAgents } from '../types';

/** Demo list used when VITE_MOCK_API=true — mirrors GET /applications shape. */
export const mockApplications: ApplicationWithAgents[] = [
  {
    id: 'GBICC',
    name: 'GBICC',
  },
  {
    id: 'SMART EU',
    name: 'SMART EU',
  },
];
