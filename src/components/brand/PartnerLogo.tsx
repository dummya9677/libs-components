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
      className={cn('flex items-center justify-center', className)}
      title="Partner logo"
    >
      <img
        src={partnerLogo}
        alt="Partner logo"
        className="h-auto w-auto max-h-10 object-contain object-left"
      />
    </div>
  );
}