import { Info } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ApplicationRequiredNoticeProps {
  message?: string;
  className?: string;
  variant?: 'boxed' | 'plain';
}

export function ApplicationRequiredNotice({
  message = 'You have to select the application first and then proceed.',
  className,
  variant = 'boxed',
}: ApplicationRequiredNoticeProps) {
  const isPlain = variant === 'plain';

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-2',
        isPlain
          ? 'text-ink-secondary'
          : 'mb-2 min-h-10 items-center gap-2.5 rounded-lg border border-client-cyan-30/50 bg-client-cyan-10/50 px-3 py-2.5',
        className,
      )}
    >
      <Info
        className={cn(
          'h-3.5 w-3.5 shrink-0',
          isPlain ? 'mt-0.5 text-ink-muted' : 'text-client-cyan-helix-light',
        )}
        strokeWidth={2}
      />
      <p
        className={cn(
          'text-xs leading-snug sm:text-[13px]',
          isPlain
            ? 'font-normal text-ink-secondary'
            : 'font-medium text-client-blue-helix-dark',
        )}
      >
        {message}
      </p>
    </div>
  );
}
