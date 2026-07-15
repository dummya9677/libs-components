import type { ReactNode } from 'react';
import { BookOpen, Database, Network, Sparkles } from 'lucide-react';
import type { AgentDefinition, AgentDemoMessage } from '@/data/agents';
import { getAgentTheme } from '@/data/agents';
import { PromptComposer } from '@/components/chat/PromptComposer';
import { formatRelativeTime } from '@/utils/time';
import { cn } from '@/utils/cn';

function AgentIcon({ agent }: { agent: AgentDefinition }) {
  const theme = getAgentTheme(agent.colorKey);
  const Icon =
    agent.colorKey === 'knowledge'
      ? BookOpen
      : agent.colorKey === 'impact'
        ? Network
        : agent.colorKey === 'ticket'
          ? Sparkles
          : Database;

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
      style={{ backgroundColor: theme.heroIcon }}
    >
      <Icon className="h-5 w-5" strokeWidth={1.5} />
    </div>
  );
}

function ProgressCard({
  agent,
  message,
}: {
  agent: AgentDefinition;
  message: AgentDemoMessage;
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

function MessageCard({
  children,
  align = 'left',
  sentAt,
  variant = 'assistant',
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  sentAt?: string;
  variant?: 'assistant' | 'user';
}) {
  return (
    <div className={cn('flex', align === 'right' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[92%] rounded-2xl px-3.5 py-3 shadow-card',
          variant === 'user'
            ? 'bg-brand-soft'
            : 'border border-app-border bg-surface-muted',
        )}
      >
        {children}
        {sentAt ? (
          <p
            className={cn(
              'mt-2 text-[11px] text-ink-muted',
              align === 'right' ? 'text-right' : 'text-left',
            )}
          >
            {formatRelativeTime(sentAt)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ChatMessage({
  agent,
  message,
}: {
  agent: AgentDefinition;
  message: AgentDemoMessage;
}) {
  if (message.role === 'progress') {
    return <ProgressCard agent={agent} message={message} />;
  }

  if (message.role === 'status') {
    return (
      <p className="px-1 text-[13px] text-ink-secondary">{message.content}</p>
    );
  }

  if (message.role === 'user') {
    return (
      <MessageCard align="right" sentAt={message.sentAt} variant="user">
        <p className="text-[13px] font-medium leading-relaxed text-brand">
          {message.content}
        </p>
      </MessageCard>
    );
  }

  return (
    <div className="space-y-2">
      <MessageCard align="left" sentAt={message.sentAt} variant="assistant">
        {message.content ? (
          <p className="text-[13px] leading-relaxed text-ink">{message.content}</p>
        ) : null}
        {message.bullets?.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-ink-secondary">
            {message.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        ) : null}
        {message.followUp ? (
          <p className="mt-2 text-[13px] leading-relaxed text-ink">
            {message.followUp}
          </p>
        ) : null}
      </MessageCard>
      {message.actions?.length ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-1">
          {message.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="text-[13px] font-medium text-brand hover:underline"
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
}

/**
 * Chat column only — System Status / bell / avatar live outside this component.
 */
export function ChatPanel({ agent }: ChatPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-app-border bg-surface shadow-card sm:rounded-2xl">
      <div className="shrink-0 px-3 pb-1.5 pt-3 sm:px-4 sm:pt-3.5">
        <h2 className="text-sm font-bold text-ink sm:text-base">AI Assistant</h2>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-secondary sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success sm:h-2 sm:w-2" />
          Online
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-2.5 scrollbar-thin sm:space-y-3 sm:px-4">
        {agent.demoMessages.map((message) => (
          <ChatMessage key={message.id} agent={agent} message={message} />
        ))}
      </div>

      <div className="shrink-0 border-t border-app-border-light p-2.5 sm:p-3">
        <PromptComposer
          compact
          toolbar="chat"
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
