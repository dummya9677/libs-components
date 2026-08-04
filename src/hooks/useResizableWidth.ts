import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'layout.chat-panel-width';
const DEFAULT_WIDTH = 480;
const MIN_WIDTH = 280;
const MAX_WIDTH = 560;

function getMaxWidth() {
  if (typeof window === 'undefined') return MAX_WIDTH;
  return Math.min(MAX_WIDTH, Math.floor(window.innerWidth * 0.55));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function readStoredWidth() {
  if (typeof window === 'undefined') return DEFAULT_WIDTH;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_WIDTH;

  const parsed = Number(stored);
  if (Number.isNaN(parsed)) return DEFAULT_WIDTH;

  return clamp(parsed, MIN_WIDTH, getMaxWidth());
}

export function useResizableWidth() {
  const [width, setWidth] = useState(readStoredWidth);
  const [isResizing, setIsResizing] = useState(false);
  const widthRef = useRef(width);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  useEffect(() => {
    const onResize = () => {
      setWidth((current) => clamp(current, MIN_WIDTH, getMaxWidth()));
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const startResize = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = widthRef.current;

    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (moveEvent: PointerEvent) => {
      const delta = startX - moveEvent.clientX;
      const nextWidth = clamp(startWidth + delta, MIN_WIDTH, getMaxWidth());
      widthRef.current = nextWidth;
      setWidth(nextWidth);
    };

    const stopResize = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.localStorage.setItem(STORAGE_KEY, String(widthRef.current));
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopResize);
      window.removeEventListener('pointercancel', stopResize);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopResize);
    window.addEventListener('pointercancel', stopResize);
  }, []);

  return { width, isResizing, startResize };
}
