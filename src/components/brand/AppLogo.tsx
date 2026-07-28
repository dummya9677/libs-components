import { cn } from '../../utils/cn';
import { env } from '../../utils/env';

export function AppLogo({
  collapsed = false,
  iconOnly = false,
  className,
}: {
  collapsed?: boolean;
  iconOnly?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      aria-label={iconOnly ? env.appName : undefined}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className={cn(
          'shrink-0',
          iconOnly ? 'h-10 w-10' : 'h-9 w-9',
        )}
      >
        <rect x="4" y="4" width="24" height="24" rx="6" fill="var(--color-logo)" />
        <path
          d="M11 16h10M16 11v10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {!collapsed && !iconOnly ? (
        <span className="text-[15px] font-semibold tracking-tight text-logo sm:text-[16px]">
          {env.appName}
        </span>
      ) : null}
    </div>
  );
}
