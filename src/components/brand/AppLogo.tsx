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
      className={cn('flex items-center', className)}
      aria-label={iconOnly ? env.appName : undefined}
    >
      <img
        src="/assets/app-logo.png"
        alt={env.appName}
        className="block h-auto w-auto object-contain object-left"
      />
      {!collapsed && !iconOnly ? (
        <span className="text-[15px] font-semibold tracking-tight text-logo sm:text-[16px]">
          {env.appName}
        </span>
      ) : null}
    </div>
  );
}
