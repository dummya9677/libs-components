import { cn } from '../../utils/cn';
import { env } from '../../utils/env';

/** Crops built-in canvas padding in public/assets/app-logo.png */
const LOGO_VIEW_BOX = 'inset(26% 15% 18% 15%)';

const LOGO_HEIGHT = {
  sidebar: 'h-16',
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
        'min-w-0 leading-none',
        variant === 'sidebar' ? 'flex-1' : 'w-full',
        className,
      )}
      aria-label={iconOnly ? env.appName : undefined}
    >
      <div
        className={cn(
          'flex items-end overflow-hidden',
          LOGO_HEIGHT[variant],
          variant === 'sidebar'
            ? 'w-full'
            : 'mx-auto w-full max-w-[300px]',
        )}
      >
        <img
          src="/assets/app-logo.png"
          alt={env.appName}
          className="block h-full w-full object-fill object-left-bottom"
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
