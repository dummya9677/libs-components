import { cn } from '../../utils/cn';
import { AppLogo } from './AppLogo';
import { PartnerLogo } from './PartnerLogo';

export function BrandLockup({
  collapsed = false,
  className,
  variant = 'sidebar',
}: {
  collapsed?: boolean;
  className?: string;
  variant?: 'sidebar' | 'login';
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center',
        variant === 'sidebar' ? 'gap-2' : 'gap-3',
        className,
      )}
    >
      {!collapsed ? (
        <div className="flex shrink-0 items-center gap-2">
          <PartnerLogo className="min-w-0 shrink" />
          <span className="h-10 w-px shrink-0 bg-app-border" aria-hidden />
        </div>
      ) : null}
      <div
        className={cn(
          'flex min-w-0 items-center',
          variant === 'sidebar' ? 'flex-1' : 'w-full justify-center',
        )}
      >
        <AppLogo
          collapsed={collapsed}
          iconOnly
          variant={variant}
          className="min-w-0 shrink"
        />
      </div>
    </div>
  );
}
