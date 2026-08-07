import type { PointerEventHandler, ReactNode } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ResizableChatAsideProps {
  children: ReactNode;
  width: number;
  isResizing?: boolean;
  onResizeStart: PointerEventHandler<HTMLDivElement>;
  className?: string;
}

export function ResizableChatAside({
  children,
  width,
  isResizing = false,
  onResizeStart,
  className,
}: ResizableChatAsideProps) {
  return (
    <aside
      style={{
        width,
        minWidth: width,
        maxWidth: '100%',
        flex: `0 0 ${width}px`,
      }}
      className={cn(
        'relative flex h-full min-h-0 shrink-0 flex-col overflow-visible bg-app-bg pb-2 pr-2 pt-0',
        isResizing && 'select-none',
        className,
      )}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize chat panel"
        title="Drag to resize"
        onPointerDown={onResizeStart}
        className={cn(
          'absolute bottom-0 left-0 top-0 z-20 w-4 cursor-col-resize touch-none',
          isResizing && 'bg-brand-soft/20',
        )}
      >
        <span
          className={cn(
            'absolute left-0 top-1/2 z-[1] flex h-10 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-app-border bg-surface text-ink-muted shadow-card transition',
            'hover:border-brand/30 hover:bg-brand-soft hover:text-brand',
            isResizing && 'border-brand/40 bg-brand-soft text-brand',
          )}
          aria-hidden
        >
          <GripVertical className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </aside>
  );
}
