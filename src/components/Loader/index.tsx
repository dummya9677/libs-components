import { cn } from '@/utils/cn';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export function Loader({ fullScreen, message, className }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen ? 'min-h-screen w-full' : 'w-full py-8',
        className,
      )}
    >
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      {message ? (
        <p className="text-sm text-ink-secondary">{message}</p>
      ) : null}
    </div>
  );
}
