import { cn } from '../../utils/cn';
import { env } from '../../utils/env';

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
      className={cn('flex w-full items-center', className)}
      aria-label={iconOnly ? env.appName : undefined}
    >
      <img
        src="/assets/app-logo.png"
        alt={env.appName}
        className={cn(
          'block object-contain object-left',
          variant === 'sidebar'
            ? 'h-11 w-full max-w-none'
            : 'h-10 w-auto max-w-[96px]',
        )}
      />
      {!collapsed && !iconOnly ? (
        <span className="text-[15px] font-semibold tracking-tight text-logo sm:text-[16px]">
          {env.appName}
        </span>
      ) : null}
    </div>
  );
}
