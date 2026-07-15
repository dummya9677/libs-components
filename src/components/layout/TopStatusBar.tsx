import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { env } from '../../utils/env';

/**
 * Top-right controls as three separate pieces:
 * 1) System Status card  2) Circular bell  3) Profile with online dot
 */
export function TopStatusBar() {
  const { user, logout } = useAuth();
  const initials =
    user?.name
      ?.split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'JD';

  return (
    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
      <div className="hidden rounded-xl border border-app-border bg-surface px-2.5 py-1.5 shadow-card xs:block sm:rounded-2xl sm:px-3 sm:py-2">
        <p className="text-[11px] font-semibold leading-none text-ink sm:text-[12px]">
          System Status
        </p>
        <div className="mt-1 flex items-center gap-1.5 sm:mt-1.5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-success sm:h-2 sm:w-2" />
          <span className="whitespace-nowrap text-[10px] text-ink-secondary sm:text-xs">
            All Systems Operational
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-app-border bg-surface text-ink-secondary shadow-card transition hover:bg-surface-muted hover:text-ink sm:h-10 sm:w-10"
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <button
        type="button"
        onClick={() => {
          void logout();
        }}
        aria-label={env.mockAuth ? 'Sign out (demo)' : 'Sign out'}
        title={env.mockAuth ? 'Sign out (demo)' : 'Sign out'}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-app-border bg-surface text-ink-secondary shadow-card transition hover:bg-surface-muted hover:text-ink sm:h-10 sm:w-10"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <div className="relative shrink-0" title={user?.name ?? 'User'}>
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand text-[10px] font-semibold text-white ring-2 ring-white sm:h-10 sm:w-10 sm:text-xs">
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
          aria-label="Online"
        />
      </div>
    </div>
  );
}
