import { api } from '@/services/api/apiSlice';

import '@/services/api/authApi';
import '@/services/api/historyApi';
import '@/services/api/chatApi';
import '@/services/api/agentsApi';

export { api };
export {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useEstablishSessionMutation,
} from '@/services/api/authApi';
export {
  useGetHistoryQuery,
  useGetConversationQuery,
} from '@/services/api/historyApi';
export { useSendMessageMutation } from '@/services/api/chatApi';
export { useGetAgentsQuery } from '@/services/api/agentsApi';
