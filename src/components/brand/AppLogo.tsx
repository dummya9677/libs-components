import { cn } from '../../utils/cn';
import { env } from '../../utils/env';

/** Crops built-in canvas padding in public/assets/app-logo.png */
const LOGO_VIEW_BOX = 'inset(20% 14% 28%)';

const LOGO_HEIGHT = {
  sidebar: 'h-16',
  login: 'h-16',
} as const;

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
        isLogin ? 'w-auto shrink-0' : 'min-w-0 flex-1',
        className,
      )}
      aria-label={iconOnly ? env.appName : undefined}
    >
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden',
          isLogin ? 'h-full w-auto' : cn(LOGO_HEIGHT.sidebar, 'w-full items-end'),
        )}
      >
        <img
          src="/assets/app-logo.png"
          alt={env.appName}
          className={cn(
            'block h-full w-auto max-w-full object-contain',
            isLogin ? 'object-center' : 'object-left-bottom',
          )}
          style={isLogin ? undefined : { objectViewBox: LOGO_VIEW_BOX }}
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
