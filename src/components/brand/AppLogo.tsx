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
      className={cn('flex items-center', className)}
      aria-label={iconOnly ? env.appName : undefined}
    >
      <img
        src="/assets/app-logo.png"
        alt={env.appName}
        className={cn(
          'block object-contain object-left',
          variant === 'sidebar'
            ? 'h-auto w-full max-h-14'
            : 'h-auto w-auto',
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
