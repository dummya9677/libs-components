import { cn } from '../../utils/cn';
import partnerLogo from '../../assets/partnerlogo.png';
import { SIDEBAR_LOGO_CLASS } from './logoSizes';

export function PartnerLogo({
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        SIDEBAR_LOGO_CLASS,
        className,
      )}
      title="Partner logo"
    >
      <img
        src={partnerLogo}
        alt="Partner logo"
        className="h-full w-auto max-w-full object-contain object-center"
      />
    </div>
  );
}
