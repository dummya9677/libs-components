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
            ? 'h-auto w-[80%] max-h-[8.5rem]'
            : 'h-auto w-[50%] max-h-10',
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
