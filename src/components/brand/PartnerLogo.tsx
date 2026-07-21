import { cn } from '../../utils/cn';
import { env } from '../../utils/env';

export function PartnerLogo({
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-8 w-[72px] shrink-0 items-center justify-center',
        className,
      )}
      title="Partner logo"
    >
      {env.partnerLogoUrl ? (
        <img
          src={env.partnerLogoUrl}
          alt="Partner logo"
          className="h-full w-full object-contain object-left"
        />
      ) : (
        <div
          className="h-8 w-[72px] rounded-md border border-dashed border-app-border bg-surface-muted/60"
          aria-hidden
        />
      )}
    </div>
  );
}
