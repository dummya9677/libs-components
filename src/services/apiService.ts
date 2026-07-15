/**
 * RTK Query APIs live in services/ — wired into Redux only via store.ts.
 * Feature endpoints are injected from dedicated modules under services/api/.
 */
import { api } from '@/services/api/apiSlice';

import '@/services/api/authApi';
import '@/services/api/historyApi';
import '@/services/api/chatApi';
import '@/services/api/agentsApi';

export const serverAPI = api;
export default serverAPI;
