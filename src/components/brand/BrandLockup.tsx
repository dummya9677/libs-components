import { cn } from '../../utils/cn';
import { AppLogo } from './AppLogo';
import {
  LOGIN_APP_LOGO_CLASS,
  LOGIN_LOGO_CLASS,
  LOGIN_PARTNER_LOGO_CLASS,
} from './logoSizes';
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
  if (variant === 'login') {
    return (
      <div
        className={cn(
          'mx-auto flex w-full max-w-xl items-center justify-center gap-8',
          className,
        )}
      >
        <PartnerLogo className={cn(LOGIN_LOGO_CLASS, LOGIN_PARTNER_LOGO_CLASS)} />
        <span
          className={cn(LOGIN_LOGO_CLASS, 'w-px bg-app-border')}
          aria-hidden
        />
        <AppLogo
          collapsed={collapsed}
          iconOnly
          variant="login"
          className={cn(LOGIN_LOGO_CLASS, LOGIN_APP_LOGO_CLASS)}
        />
      </div>
    );
  }

  return (
    <div className={cn('flex w-full min-w-0 items-center gap-2', className)}>
      {!collapsed ? (
        <>
          <PartnerLogo className="min-w-0 flex-1 basis-0" />
          <span className="h-10 w-px shrink-0 bg-app-border" aria-hidden />
        </>
      ) : null}
      <AppLogo
        collapsed={collapsed}
        iconOnly
        variant="sidebar"
        className={cn(!collapsed && 'min-w-0 flex-1 basis-0')}
      />
    </div>
  );
}
