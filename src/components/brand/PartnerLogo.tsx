import { cn } from '../../utils/cn';
import partnerLogo from '../../assets/partnerlogo.png'; // Update the path if your assets folder is elsewhere

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
      <img
        src={partnerLogo}
        alt="Partner logo"
        className="h-full w-full object-contain object-left"
      />
    </div>
  );
}