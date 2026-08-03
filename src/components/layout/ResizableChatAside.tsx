import type { PointerEventHandler, ReactNode } from 'react';
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
      style={{ width }}
      className={cn(
        'relative flex h-full min-h-0 shrink-0 flex-col overflow-hidden bg-app-bg p-2 pt-0',
        isResizing && 'select-none',
        className,
      )}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize chat panel"
        onPointerDown={onResizeStart}
        className={cn(
          'absolute bottom-0 left-0 top-0 z-10 w-1.5 -translate-x-1/2 cursor-col-resize touch-none',
          'before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-transparent before:transition-colors',
          'hover:before:bg-brand/40',
          isResizing && 'before:bg-brand/60',
        )}
      />
      {children}
    </aside>
  );
}
