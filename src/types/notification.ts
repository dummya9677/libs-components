export type NotificationType = 'info' | 'warning' | 'success' | 'alert';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: NotificationType;
  read: boolean;
}
