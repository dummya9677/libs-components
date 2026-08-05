import { cn } from '../../utils/cn';
import partnerLogo from '../../assets/partnerlogo.png';

export function PartnerLogo({
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center',
        'h-10 max-w-[120px]',
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
