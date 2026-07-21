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
      <AppLogo collapsed={collapsed} className="min-w-0 shrink" />
      {!collapsed ? (
        <>
          <span className="h-6 w-px shrink-0 bg-app-border" aria-hidden />
          <PartnerLogo className="min-w-0 shrink" />
        </>
      ) : null}
    </div>
  );
}
