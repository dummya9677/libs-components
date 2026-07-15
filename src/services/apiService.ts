/**
 * RTK Query APIs live in services/ — wired into Redux only via store.ts.
 * Feature endpoints are injected from dedicated modules under services/api/.
 */
import { api } from './api/apiSlice';

import './api/authApi';
import './api/historyApi';
import './api/chatApi';
import './api/agentsApi';

export const serverAPI = api;
export default serverAPI;
