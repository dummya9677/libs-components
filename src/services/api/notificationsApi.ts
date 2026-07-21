import { api } from './apiSlice';
import { mockNotifications } from '../../data/notifications.mock';
import type { AppNotification } from '../../types/notification';

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<AppNotification[], void>({
      // Swap queryFn for: query: () => '/notifications',
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 120));
        return { data: mockNotifications };
      },
      providesTags: ['Notification'],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;
