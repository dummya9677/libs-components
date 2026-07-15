import { useState, type FormEvent, type KeyboardEvent } from 'react';
import {
  Paperclip,
  Table2,
  Code2,
  Globe,
  Settings2,
  SendHorizonal,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface PromptComposerProps {
  placeholder?: string;
  onSend?: (value: string) => void;
  compact?: boolean;
  className?: string;
  toolbar?: 'main' | 'chat';
  showSend?: boolean;
}

export function PromptComposer({
  placeholder = 'Type your message…',
  onSend,
  compact = false,
  className,
  toolbar = 'main',
  showSend = true,
}: PromptComposerProps) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const tools =
    toolbar === 'chat'
      ? [Paperclip, Table2, Code2, Settings2]
      : [Paperclip, Table2, Code2, Globe];

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'rounded-xl border border-app-border bg-surface',
        compact ? 'p-2.5' : 'p-3',
        className,
      )}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={compact ? 2 : 2}
        placeholder={placeholder}
        className={cn(
          'w-full resize-none bg-transparent text-xs text-ink placeholder:text-ink-muted focus:outline-none sm:text-sm',
          compact ? 'min-h-[40px]' : 'min-h-[48px]',
        )}
      />
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-0.5">
          {tools.map((Icon, i) => (
            <button
              key={i}
              type="button"
              className="rounded-md p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink-secondary"
              aria-label="Composer tool"
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
            </button>
          ))}
        </div>
        {showSend ? (
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="Send"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizonal className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </form>
  );
}
