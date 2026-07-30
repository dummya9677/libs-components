import type { MessageSource } from '../../types';
import { ExternalLink, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MessageSourcesProps {
  sources: MessageSource[];
  className?: string;
}

export function MessageSources({ sources, className }: MessageSourcesProps) {
  if (!sources.length) return null;

  return (
    <div className={cn('mt-3 border-t border-app-border-light pt-2.5', className)}>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        Sources
      </p>
      <ul className="space-y-1">
        {sources.map((source) => {
          const label = source.label ? `${source.label}: ` : '';
          const key = `${source.url ?? ''}-${source.title}`;

          if (source.url) {
            return (
              <li key={key}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1 text-[12px] text-brand hover:underline"
                >
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-70" />
                  <span>
                    {label}
                    {source.title}
                  </span>
                </a>
              </li>
            );
          }

          return (
            <li key={key} className="text-[12px] text-ink-secondary">
              {label}
              {source.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface MessageToolsUsedProps {
  tools: string[];
  className?: string;
}

export function MessageToolsUsed({ tools, className }: MessageToolsUsedProps) {
  if (!tools.length) return null;

  return (
    <div className={cn('mb-2 flex flex-wrap items-center gap-1.5', className)}>
      {tools.map((tool) => (
        <span
          key={tool}
          className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-ink-secondary"
        >
          <Search className="h-3 w-3" />
          {tool}
        </span>
      ))}
    </div>
  );
}
