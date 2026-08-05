import { cn } from '../../utils/cn';
import { env } from '../../utils/env';
import { LOGIN_LOGO_CLASS, SIDEBAR_LOGO_CLASS } from './logoSizes';

export function AppLogo({
  collapsed = false,
  iconOnly = false,
  variant = 'sidebar',
  className,
}: {
  collapsed?: boolean;
  iconOnly?: boolean;
  variant?: 'sidebar' | 'login';
  className?: string;
}) {
  const isLogin = variant === 'login';

  return (
    <div
      className={cn(
        'leading-none',
        isLogin ? LOGIN_LOGO_CLASS : SIDEBAR_LOGO_CLASS,
        className,
      )}
      aria-label={iconOnly ? env.appName : undefined}
    >
      <div className="flex h-full w-auto items-center justify-center overflow-hidden">
        <img
          src="/assets/app-logo.png"
          alt={env.appName}
          className="h-full w-auto max-w-full object-contain object-center"
        />
      </div>
      {!collapsed && !iconOnly ? (
        <span className="text-[15px] font-semibold tracking-tight text-logo sm:text-[16px]">
          {env.appName}
        </span>
      ) : null}
    </div>
  );
}
