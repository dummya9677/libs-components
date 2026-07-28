import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Mic, SendHorizonal } from 'lucide-react';
import { clientBrandCardGradient } from '../../config/clientColors';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { cn } from '../../utils/cn';

interface PromptComposerProps {
  placeholder?: string;
  onSend?: (value: string) => void;
  compact?: boolean;
  className?: string;
  showSend?: boolean;
  gradientBorder?: boolean;
  disabled?: boolean;
  sendLabel?: string;
}

export function PromptComposer({
  placeholder = 'Type your message…',
  onSend,
  compact = false,
  className,
  showSend = true,
  gradientBorder = true,
  disabled = false,
  sendLabel = 'Send',
}: PromptComposerProps) {
  const [value, setValue] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speechBaseRef = useRef('');

  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    onResult: (transcript, isFinal) => {
      setSpeechError(null);
      if (isFinal) {
        const next = [speechBaseRef.current, transcript].filter(Boolean).join(' ').trim();
        speechBaseRef.current = next;
        setValue(next);
      } else {
        const next = [speechBaseRef.current, transcript].filter(Boolean).join(' ').trim();
        setValue(next);
      }
    },
    onError: (message) => {
      setSpeechError(message);
    },
  });

  const submit = () => {
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
    if (!isSupported) return;
    setSpeechError(null);
    if (!isListening) {
      speechBaseRef.current = value.trim();
    }
    toggleListening();
  };

  const form = (
    <form
      onSubmit={onSubmit}
      style={gradientBorder ? { background: clientBrandCardGradient } : undefined}
      className={cn(
        gradientBorder
          ? 'rounded-xl shadow-card'
          : 'rounded-lg border border-white/70 bg-white/80 backdrop-blur-sm',
        compact ? 'p-2.5' : 'p-3',
      )}
    >
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            speechBaseRef.current = e.target.value.trim();
          }}
          onKeyDown={onKeyDown}
          rows={compact ? 2 : 2}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full resize-none bg-transparent text-xs text-client-blue-helix-dark caret-client-cyan-helix-light placeholder:text-client-cyan-helix-light/55 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm',
            compact ? 'min-h-[40px]' : 'min-h-[48px]',
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
              disabled={!isSupported}
              aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
              aria-pressed={isListening}
              title={
                !isSupported
                  ? 'Speech recognition is not supported in this browser'
                  : isListening
                    ? 'Stop dictation'
                    : 'Dictate with microphone'
              }
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-lg transition',
                isListening
                  ? 'bg-client-cyan-10 text-client-blue-helix-dark'
                  : 'text-client-cyan-helix-light/70 hover:bg-client-cyan-10 hover:text-client-blue-helix-dark',
                !isSupported && 'cursor-not-allowed opacity-40',
              )}
            >
              <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
              {isListening ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-client-cyan-helix-light opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-client-cyan-helix-light" />
                </span>
              ) : null}
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
  );

  return <div className={className}>{form}</div>;
}
