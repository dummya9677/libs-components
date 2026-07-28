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
        <>
          <PartnerLogo className="min-w-0 shrink" />
          <span className="h-8 w-px shrink-0 bg-app-border" aria-hidden />
        </>
      ) : null}
      <AppLogo
        collapsed={collapsed}
        iconOnly
        className="min-w-0 shrink"
      />
    </div>
  );
}
