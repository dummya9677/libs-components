import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';import type { AgentDefinition } from '../../data/agents';
import { useRelativeTime } from '../../hooks/useRelativeTime';
import type { HistoryMessage } from '../../types';
import { AgentIcon } from '../icons/AgentIcon';
import { PromptComposer } from './PromptComposer';
import { ApplicationRequiredNotice } from '../application/ApplicationRequiredNotice';
import { FormattedMessageContent } from './FormattedMessageContent';
import { MessageSources, MessageToolsUsed } from './MessageMetadata';
import { cn } from '../../utils/cn';

function MessageTimestamp({ sentAt }: { sentAt?: string }) {
  const label = useRelativeTime(sentAt);
  if (!label) return null;

  return <span className="text-[10px] font-medium text-ink-muted">{label}</span>;
}

function ProgressCard({
  agent,
  message,
}: {
  agent: AgentDefinition;
  message: HistoryMessage;
}) {
  const subtitle =
    message.progressLabel
      ?.replace(`${agent.name} · `, '')
      ?.replace(`${agent.name} ·`, '') ?? 'Working…';

  return (
    <div className="rounded-2xl border border-app-border bg-surface-muted/80 p-3.5 shadow-card">
      <div className="flex items-start gap-3">
        <AgentIcon agent={agent} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{agent.name}</p>
          <p className="mt-0.5 text-xs text-ink-secondary">{subtitle}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${message.progress ?? 0}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold text-brand">
          {message.progress}%
        </span>
      </div>
    </div>
  );
}

function MessageBubble({
  children,
  align = 'left',
  sentAt,
  variant = 'assistant',
  agent,
  isPending = false,
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  sentAt?: string;
  variant?: 'assistant' | 'user';
  agent?: AgentDefinition;
  isPending?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex gap-2',
        align === 'right' ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {variant === 'assistant' && agent ? <AgentIcon agent={agent} size="sm" /> : null}

      <div
        className={cn(
          'min-w-0 max-w-[88%] sm:max-w-[82%]',
          align === 'right' ? 'items-end' : 'items-start',
          'flex flex-col gap-1',
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5 shadow-card',
            variant === 'user'
              ? 'rounded-br-md bg-brand text-white'
              : 'rounded-bl-md border border-app-border bg-surface',
            isPending && 'opacity-90',
          )}
        >
          {children}
        </div>
        <div
          className={cn(
            'px-1',
            align === 'right' ? 'text-right' : 'text-left',
          )}
        >
          <MessageTimestamp sentAt={sentAt} />
        </div>
      </div>
    </div>
  );
}

function AssistantMessageSkeleton({ agent }: { agent: AgentDefinition }) {
  return (
    <div className="flex gap-2">
      <AgentIcon agent={agent} size="sm" />
      <div className="min-w-0 max-w-[88%] sm:max-w-[82%]">
        <div className="rounded-2xl rounded-bl-md border border-app-border bg-surface px-3.5 py-3 shadow-card">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            <span className="text-[11px] font-medium text-ink-secondary">
              {agent.name} is loading results...
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-full animate-pulse rounded-full bg-surface-muted" />
            <div className="h-2.5 w-[92%] animate-pulse rounded-full bg-surface-muted" />
            <div className="h-2.5 w-[76%] animate-pulse rounded-full bg-surface-muted" />
          </div>
        </div>
        <p className="mt-1 px-1 text-[10px] font-medium text-ink-muted">Just now</p>
      </div>
    </div>
  );
}

function ChatMessage({
  agent,
  message,
  onSend,
}: {
  agent: AgentDefinition;
  message: HistoryMessage;
  onSend?: (content: string) => void | Promise<void>;
}) {
  if (message.isPending) {
    if (message.content?.trim()) {
      return (
        <MessageBubble
          align="left"
          sentAt={message.createdAt}
          variant="assistant"
          agent={agent}
        >
          <FormattedMessageContent
            text={message.content}
            className="text-[13px] leading-relaxed text-ink-secondary"
          />
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-brand align-middle" />
        </MessageBubble>
      );
    }

    return <AssistantMessageSkeleton agent={agent} />;
  }

  if (message.role === 'progress') {
    return <ProgressCard agent={agent} message={message} />;
  }

  if (message.role === 'status') {
    return (
      <p className="px-1 text-center text-[12px] text-ink-secondary">{message.content}</p>
    );
  }

  if (message.role === 'user') {
    return (
      <MessageBubble align="right" sentAt={message.createdAt} variant="user">
        <p className="whitespace-pre-wrap text-[13px] font-medium leading-relaxed">
          {message.content}
        </p>
      </MessageBubble>
    );
  }

  return (
    <div className="space-y-2">
      <MessageBubble
        align="left"
        sentAt={message.createdAt}
        variant="assistant"
        agent={agent}
      >
        {message.toolsUsed?.length ? (
          <MessageToolsUsed tools={message.toolsUsed} />
        ) : null}
        {message.content?.trim() ? (
          <FormattedMessageContent
            text={message.content}
            className="text-[13px] leading-relaxed text-ink-secondary"
          />
        ) : message.sources?.length ? null : (
          <p className="text-[13px] italic text-ink-muted">No message content.</p>
        )}
        {message.sources?.length ? (
          <MessageSources sources={message.sources} />
        ) : null}
        {message.bullets?.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-ink-secondary">
            {message.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
        {message.followUp ? (
          <p className="mt-2 text-[13px] leading-relaxed text-ink">
            {message.followUp}
          </p>
        ) : null}
      </MessageBubble>
      {message.actions?.length ? (
        <div className="flex flex-wrap gap-2 pl-9">
          {message.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => void onSend?.(action.label)}
              className="rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-[12px] font-medium text-brand transition hover:bg-brand/10"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface ChatPanelProps {
  agent: AgentDefinition;
  messages: HistoryMessage[];
  onSend: (content: string) => void | Promise<void>;
  isStreaming?: boolean;
  isThreadReady?: boolean;
  isCreatingThread?: boolean;
  needsApplication?: boolean;
  error?: string | null;
  hasMoreHistory?: boolean;
  isLoadingOlderMessages?: boolean;
  onLoadOlderMessages?: () => void | Promise<void>;
}

/**
 * Chat column — displays messages and streams assistant replies in real time.
 */
export function ChatPanel({
  agent,
  messages,
  onSend,
  isStreaming = false,
  isThreadReady = true,
  isCreatingThread = false,
  needsApplication = false,
  error = null,
  hasMoreHistory = false,
  isLoadingOlderMessages = false,
  onLoadOlderMessages,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const prevMessagesRef = useRef({ firstId: '', lastId: '', count: 0 });
  const scrollRestoreRef = useRef<{ scrollTop: number; scrollHeight: number } | null>(
    null,
  );
  const isFetchingOlderRef = useRef(false);

  const tryLoadOlderMessages = useCallback(() => {
    if (
      !hasMoreHistory ||
      isLoadingOlderMessages ||
      isStreaming ||
      isFetchingOlderRef.current ||
      !onLoadOlderMessages
    ) {
      return;
    }

    const container = scrollRef.current;
    if (!container) return;

    isFetchingOlderRef.current = true;
    scrollRestoreRef.current = {
      scrollTop: container.scrollTop,
      scrollHeight: container.scrollHeight,
    };

    void Promise.resolve(onLoadOlderMessages()).finally(() => {
      isFetchingOlderRef.current = false;
    });
  }, [hasMoreHistory, isLoadingOlderMessages, isStreaming, onLoadOlderMessages]);

  useEffect(() => {
    const container = scrollRef.current;
    const sentinel = topSentinelRef.current;
    if (!container || !sentinel || !hasMoreHistory) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          tryLoadOlderMessages();
        }
      },
      {
        root: container,
        rootMargin: '120px 0px 0px 0px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreHistory, tryLoadOlderMessages]);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const firstId = messages[0]?.id ?? '';
    const lastId = messages[messages.length - 1]?.id ?? '';
    const prev = prevMessagesRef.current;

    const prepended =
      messages.length > prev.count &&
      firstId !== prev.firstId &&
      lastId === prev.lastId;
    const appended = lastId !== prev.lastId && firstId === prev.firstId;
    const initialLoad = prev.count === 0 && messages.length > 0;
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;

    if (prepended && scrollRestoreRef.current) {
      const { scrollTop, scrollHeight } = scrollRestoreRef.current;
      container.scrollTop = scrollTop + (container.scrollHeight - scrollHeight);
      scrollRestoreRef.current = null;
    } else if (initialLoad || appended || (isStreaming && nearBottom)) {
      bottomRef.current?.scrollIntoView({
        behavior: appended || isStreaming ? 'smooth' : 'auto',
      });
    }

    prevMessagesRef.current = { firstId, lastId, count: messages.length };
  }, [messages, isStreaming]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-app-border bg-surface shadow-card sm:rounded-2xl">
      <div className="flex shrink-0 flex-col items-center px-3 pb-1.5 pt-3 text-center sm:px-4 sm:pt-3.5">
        <h2 className="text-sm font-bold text-ink sm:text-base">AI Assistant</h2>
        <div className="mt-0.5 flex items-center justify-center gap-1.5 text-[11px] text-ink-secondary sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success sm:h-2 sm:w-2" />
          Online
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-2.5 scrollbar-thin sm:space-y-3.5 sm:px-4"
      >
        {needsApplication ? (
          <div className="flex flex-1 items-center justify-center px-2 py-6">
            <ApplicationRequiredNotice message="Select an application in the workspace to start chatting." />
          </div>
        ) : (
          <>
            <div ref={topSentinelRef} className="h-px w-full shrink-0" aria-hidden />

            {isLoadingOlderMessages ? (
              <div className="flex justify-center py-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
              </div>
            ) : null}

            {isCreatingThread && messages.length === 0 && !isStreaming ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
                <p className="text-[13px] text-ink-muted">Loading conversation…</p>
              </div>
            ) : null}

            {messages.length === 0 && !isStreaming && !isCreatingThread ? (
              <p className="py-8 text-center text-[13px] text-ink-muted">
                Ask a question to start the conversation.
              </p>
            ) : null}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                agent={agent}
                message={message}
                onSend={onSend}
              />
            ))}
          </>
        )}

        {error ? (
          <p className="rounded-lg border border-status-danger/30 bg-red-50 px-3 py-2 text-[12px] text-status-danger">
            {error}
          </p>
        ) : null}

        <div ref={bottomRef} className="h-1 w-full shrink-0" aria-hidden />
      </div>

      <div className="shrink-0 border-t border-app-border-light p-2.5 sm:p-3">
        <PromptComposer
          compact
          placeholder={
            needsApplication
              ? 'Select an application in the workspace to chat…'
              : 'Type your message...'
          }
          onSend={onSend}
          disabled={isStreaming || !isThreadReady || needsApplication}
          sendLabel="Analyze"
        />
      </div>
    </div>
  );
}
