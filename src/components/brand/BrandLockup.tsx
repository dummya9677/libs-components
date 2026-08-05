import { cn } from '../../utils/cn';
import { AppLogo } from './AppLogo';
import { PartnerLogo } from './PartnerLogo';

/** Shared max height for login logos — width scales from image aspect ratio. */
const LOGIN_LOGO_HEIGHT = 'h-16';

export function BrandLockup({
  collapsed = false,
  className,
  variant = 'sidebar',
}: {
  collapsed?: boolean;
  className?: string;
  variant?: 'sidebar' | 'login';
}) {
  if (variant === 'login') {
    return (
      <div
        className={cn(
          'mx-auto flex w-full max-w-lg items-center justify-center gap-6',
          className,
        )}
      >
        <PartnerLogo
          className={cn(LOGIN_LOGO_HEIGHT, 'max-w-[150px]')}
        />
        <span
          className={cn(LOGIN_LOGO_HEIGHT, 'w-px shrink-0 bg-app-border')}
          aria-hidden
        />
        <AppLogo
          collapsed={collapsed}
          iconOnly
          variant="login"
          className={cn(LOGIN_LOGO_HEIGHT, 'max-w-[200px]')}
        />
      </div>
    );
  }

  return (
    <div className={cn('flex min-w-0 items-center gap-2', className)}>
      {!collapsed ? (
        <>
          <PartnerLogo />
          <span className="h-10 w-px shrink-0 bg-app-border" aria-hidden />
        </>
      ) : null}
      <AppLogo
        collapsed={collapsed}
        iconOnly
        variant="sidebar"
        className="min-w-0 flex-1"
      />
    </div>
  );
}
