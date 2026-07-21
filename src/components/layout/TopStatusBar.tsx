import {
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  LogOut,
  Search,
  X,
} from 'lucide-react';
import { useMemo, useRef, useState, type RefObject } from 'react';
import { useDismissible } from '../../hooks/useDismissible';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  dismissNotification,
  markAllNotificationsRead,
  markNotificationRead,
  selectDismissedNotificationIds,
  selectReadNotificationIds,
} from '../../redux/slice/notificationsUiSlice';
import { useGetNotificationsQuery } from '../../services/api/notificationsApi';
import type { AppNotification, NotificationType } from '../../types/notification';
import { env } from '../../utils/env';
import { cn } from '../../utils/cn';
import {
  formatNotificationTime,
  getUserInitials,
} from '../../utils/userDisplay';

const notificationAccent: Record<NotificationType, string> = {
  info: 'bg-client-cyan-10 text-client-cyan-helix-light',
  warning: 'bg-amber-50 text-amber-600',
  success: 'bg-status-success-soft text-emerald-600',
  alert: 'bg-red-50 text-status-danger',
};

export function TopStatusBar() {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useDismissible(notificationsOpen, () => setNotificationsOpen(false), notificationsRef);
  useDismissible(profileOpen, () => setProfileOpen(false), profileRef);

  const initials = getUserInitials(user?.name);

  const closeAll = () => {
    setNotificationsOpen(false);
    setProfileOpen(false);
  };

  return (
    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
      <button
        type="button"
        disabled
        aria-label="Search (coming soon)"
        title="Search (coming soon)"
        className="flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-app-border bg-surface text-ink-muted/50 shadow-card sm:h-10 sm:w-10"
      >
        <Search className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <NotificationsMenu
        containerRef={notificationsRef}
        isOpen={notificationsOpen}
        onOpen={() => {
          setProfileOpen(false);
          setNotificationsOpen((open) => !open);
        }}
      />

      <ProfileMenu
        containerRef={profileRef}
        initials={initials}
        isOpen={profileOpen}
        user={user}
        onOpen={() => {
          setNotificationsOpen(false);
          setProfileOpen((open) => !open);
        }}
        onLogout={() => {
          closeAll();
          void logout();
        }}
      />
    </div>
  );
}

function NotificationsMenu({
  containerRef,
  isOpen,
  onOpen,
}: {
  containerRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const dispatch = useAppDispatch();
  const readIds = useAppSelector(selectReadNotificationIds);
  const dismissedIds = useAppSelector(selectDismissedNotificationIds);
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();

  const visibleNotifications = useMemo(() => {
    return notifications
      .filter((item) => !dismissedIds.includes(item.id))
      .map((item) => ({
        ...item,
        read: item.read || readIds.includes(item.id),
      }));
  }, [dismissedIds, notifications, readIds]);

  const unreadCount = visibleNotifications.filter((item) => !item.read).length;

  const handleMarkAllRead = () => {
    dispatch(
      markAllNotificationsRead(visibleNotifications.map((item) => item.id)),
    );
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={onOpen}
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-app-border bg-surface text-ink-secondary shadow-card transition hover:bg-surface-muted hover:text-ink sm:h-10 sm:w-10"
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-danger px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-1.5rem,22rem)] overflow-hidden rounded-xl border border-app-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-app-border-light px-3 py-2.5">
            <p className="text-xs font-semibold text-ink">Notifications</p>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1 text-[10px] font-semibold text-client-cyan-helix-light transition hover:text-client-blue-helix-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all as read
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto scrollbar-thin">
            {isLoading ? (
              <p className="px-3 py-6 text-center text-[11px] text-ink-muted">
                Loading notifications…
              </p>
            ) : visibleNotifications.length === 0 ? (
              <p className="px-3 py-6 text-center text-[11px] text-ink-muted">
                You&apos;re all caught up.
              </p>
            ) : (
              <ul>
                {visibleNotifications.map((item) => (
                  <NotificationRow
                    key={item.id}
                    item={item}
                    onDismiss={() => dispatch(dismissNotification(item.id))}
                    onMarkRead={() => dispatch(markNotificationRead(item.id))}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationRow({
  item,
  onMarkRead,
  onDismiss,
}: {
  item: AppNotification;
  onMarkRead: () => void;
  onDismiss: () => void;
}) {
  return (
    <li
      className={cn(
        'border-b border-app-border-light px-3 py-2.5 last:border-b-0',
        !item.read && 'bg-client-cyan-10/30',
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
            notificationAccent[item.type],
          )}
        >
          <Bell className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold leading-snug text-ink">
              {item.title}
            </p>
            <span className="shrink-0 text-[9px] text-ink-muted">
              {formatNotificationTime(item.createdAt)}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] leading-snug text-ink-secondary">
            {item.message}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {!item.read ? (
              <button
                type="button"
                onClick={onMarkRead}
                className="inline-flex items-center gap-1 text-[9px] font-semibold text-client-cyan-helix-light hover:underline"
              >
                <Check className="h-3 w-3" />
                Mark as read
              </button>
            ) : null}
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex items-center gap-1 text-[9px] font-semibold text-ink-muted hover:text-ink"
            >
              <X className="h-3 w-3" />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function ProfileMenu({
  containerRef,
  initials,
  isOpen,
  user,
  onOpen,
  onLogout,
}: {
  containerRef: RefObject<HTMLDivElement>;
  initials: string;
  isOpen: boolean;
  user: ReturnType<typeof useAuth>['user'];
  onOpen: () => void;
  onLogout: () => void;
}) {
  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        onClick={onOpen}
        className="flex max-w-[11rem] items-center gap-2 rounded-full py-0.5 pl-0.5 pr-1.5 transition hover:bg-surface-muted/80 sm:max-w-[14rem] sm:pr-2"
      >
        <div className="relative shrink-0">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-client-blue-helix-dark text-[10px] font-semibold text-white ring-2 ring-white sm:h-10 sm:w-10 sm:text-xs">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 z-10 h-2.5 w-2.5 rounded-full border-2 border-white bg-status-success sm:h-3 sm:w-3"
            aria-hidden
          />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[11px] font-semibold leading-tight text-ink sm:text-xs">
            {user?.name ?? 'Guest User'}
          </p>
          <p className="truncate text-[9px] leading-tight text-ink-secondary sm:text-[10px]">
            {user?.designation ?? 'Team Member'}
          </p>
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-ink-muted transition-transform',
            isOpen && 'rotate-180',
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-1.5rem,16rem)] overflow-hidden rounded-xl border border-app-border bg-surface shadow-lg">
          <div className="border-b border-app-border-light px-3 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-client-blue-helix-dark text-xs font-semibold text-white">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink">
                  {user?.name ?? 'Guest User'}
                </p>
                <p className="truncate text-[10px] text-ink-secondary">
                  {user?.designation ?? 'Team Member'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-app-border-light px-3 py-2.5">
            <p className="text-[10px] font-semibold text-ink">System Status</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-status-success" />
              <span className="text-[10px] text-ink-secondary">
                All Systems Operational
              </span>
            </div>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-client-cyan-10 px-3 py-2 text-[11px] font-semibold text-client-blue-helix-dark transition hover:bg-client-cyan-30/40"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
              {env.mockAuth ? 'Sign out (demo)' : 'Sign out'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
