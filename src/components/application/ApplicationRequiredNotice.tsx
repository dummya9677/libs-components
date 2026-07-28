import { Info } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ApplicationRequiredNoticeProps {
  message?: string;
  className?: string;
}

export function ApplicationRequiredNotice({
  message = 'You have to select the application first and then proceed.',
  className,
}: ApplicationRequiredNoticeProps) {
  return (
    <div
      role="status"
      className={cn(
        'mb-2 flex items-center gap-2 rounded-lg border border-client-cyan-30/50 bg-client-cyan-10/60 px-3 py-2.5',
        className,
      )}
    >
      <Info
        className="h-3.5 w-3.5 shrink-0 text-client-cyan-helix-light"
        strokeWidth={2}
      />
      <p className="text-xs font-medium leading-snug text-client-blue-helix-dark sm:text-[13px]">
        {message}
      </p>
    </div>
  );
}
