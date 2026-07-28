import { cn } from '../../utils/cn';
import { env } from '../../utils/env';

/**
 * Crops built-in canvas padding in public/assets/app-logo.png.
 * Bottom inset is larger — the file has more empty space below the mark than above.
 */
const LOGO_VIEW_BOX = 'inset(22% 15% 30%)';

const LOGO_HEIGHT = {
  sidebar: 'h-10',
  login: 'h-[4.5rem]',
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
  return (
    <div
      className={cn(
        'm-0 min-w-0 p-0 leading-none',
        variant === 'sidebar' ? 'flex-1' : 'w-full',
        className,
      )}
      aria-label={iconOnly ? env.appName : undefined}
    >
      <div
        className={cn(
          'm-0 overflow-hidden p-0',
          LOGO_HEIGHT[variant],
          variant === 'sidebar'
            ? 'w-full'
            : 'mx-auto w-full max-w-[300px]',
        )}
      >
        <img
          src="/assets/app-logo.png"
          alt={env.appName}
          className="m-0 block size-full object-cover object-left p-0"
          style={{ objectViewBox: LOGO_VIEW_BOX }}
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
