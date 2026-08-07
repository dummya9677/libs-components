import { forwardRef, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Mic, SendHorizonal } from 'lucide-react';
import { clientBrandCardGradient } from '../../config/clientColors';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { cn } from '../../utils/cn';

interface PromptComposerProps {
  placeholder?: string;
  onSend?: (value: string) => void;
  compact?: boolean;
  size?: 'default' | 'large';
  className?: string;
  showSend?: boolean;
  gradientBorder?: boolean;
  disabled?: boolean;
  sendLabel?: string;
}

export const PromptComposer = forwardRef<HTMLTextAreaElement, PromptComposerProps>(function PromptComposer({
  placeholder = 'Type your message…',
  onSend,
  compact = false,
  size = 'default',
  className,
  showSend = true,
  gradientBorder = true,
  disabled = false,
  sendLabel = 'Send',
}, ref) {
  const [value, setValue] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speechBaseRef = useRef('');

  const { isListening, isSupported, toggleListening, stopListening } = useSpeechRecognition({
    onResult: (transcript, isFinal) => {
      setSpeechError(null);
      const next = [speechBaseRef.current, transcript].filter(Boolean).join(' ').trim();
      if (isFinal) {
        speechBaseRef.current = next;
      }
      setValue(next);
    },
    onError: (message) => {
      setSpeechError(message);
    },
  });

  useEffect(() => {
    if (disabled && isListening) {
      stopListening();
    }
  }, [disabled, isListening, stopListening]);

  const submit = () => {
    if (isListening) {
      stopListening();
    }

    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend?.(trimmed);
    setValue('');
    speechBaseRef.current = '';
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

  const handleMicToggle = () => {
    if (!isSupported || disabled) return;
    setSpeechError(null);
    if (!isListening) {
      speechBaseRef.current = value.trim();
    }
    toggleListening();
  };

  const isLarge = size === 'large';

  return (
    <div className={className}>
      <form
      onSubmit={onSubmit}
      style={gradientBorder ? { background: clientBrandCardGradient } : undefined}
      className={cn(
        gradientBorder
          ? 'rounded-xl shadow-card'
          : 'rounded-lg border border-white/70 bg-white/80 backdrop-blur-sm',
        compact ? 'p-2.5' : isLarge ? 'p-4 sm:p-5' : 'p-3',
      )}
    >
        {isListening ? (
          <div
            className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-client-cyan-helix-light/35 bg-client-cyan-10/90 px-2.5 py-1.5"
            role="status"
            aria-live="polite"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-danger opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-danger" />
              </span>
              <p className="truncate text-[11px] font-medium text-client-blue-helix-dark sm:text-xs">
                Recording… speak now
              </p>
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold text-client-blue-helix-dark transition hover:bg-white/70 sm:text-[11px]"
            >
              Stop
            </button>
          </div>
        ) : null}

        <textarea
          ref={ref}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            speechBaseRef.current = e.target.value.trim();
          }}
          onKeyDown={onKeyDown}
          rows={isLarge ? 3 : 2}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full resize-none bg-transparent text-client-blue-helix-dark caret-client-cyan-helix-light placeholder:text-client-cyan-helix-light/55 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
            compact
              ? 'min-h-[40px] text-xs'
              : isLarge
                ? 'min-h-[88px] text-sm sm:min-h-[96px] sm:text-base'
                : 'min-h-[48px] text-xs sm:text-sm',
          )}
        />

        {speechError ? (
          <p className="mt-1 text-[10px] text-status-danger" role="alert">
            {speechError}
          </p>
        ) : null}

        <div className="mt-1.5 flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={!isSupported || disabled}
              aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
              aria-pressed={isListening}
              title={
                disabled
                  ? 'Wait for the response to finish loading'
                  : !isSupported
                    ? 'Speech recognition is not supported in this browser'
                    : isListening
                      ? 'Stop dictation'
                      : 'Dictate with microphone'
              }
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg transition',
                isListening
                  ? 'bg-client-cyan-10 text-client-blue-helix-dark'
                  : 'text-client-cyan-helix-light/70 hover:bg-client-cyan-10 hover:text-client-blue-helix-dark',
                (!isSupported || disabled) && 'cursor-not-allowed opacity-40',
              )}
            >
              <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
            </button>

            {showSend ? (
            <button
              type="submit"
              disabled={!value.trim() || disabled}
              aria-label={sendLabel}
              title={sendLabel}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-client-cyan-helix-light text-white transition hover:bg-client-blue-helix-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendHorizonal className="h-3.5 w-3.5" />
            </button>
            ) : null}
        </div>
      </form>
    </div>
  );
});
