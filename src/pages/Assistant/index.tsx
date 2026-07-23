import { MessageSquare, Menu, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getAgentBySlug } from '../../data/agents';
import { AgentWorkspace } from '../../components/agent/AgentWorkspace';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { TopStatusBar } from '../../components/layout/TopStatusBar';
import { useAgentChat } from '../../hooks/useAgentChat';
import { useAuth } from '../../hooks/useAuth';
import { useLayout } from '../../hooks/useLayout';
import { cn } from '../../utils/cn';

export function AssistantPage() {
  const { agentSlug } = useParams();
  const agent = getAgentBySlug(agentSlug);
  const { user } = useAuth();
  const { openSidebar, chatOpen, toggleChat, closeChat } = useLayout();
  const firstName = user?.name?.split(' ')[0] ?? 'John';

  const {
    isCreatingThread,
    isThreadReady,
    messages,
    streamingAnswer,
    isStreaming,
    error,
    sendMessage,
  } = useAgentChat(agent.id);

  const chatPanel = (
    <ChatPanel
      agent={agent}
      messages={messages}
      onSend={sendMessage}
      streamingAnswer={streamingAnswer}
      isStreaming={isStreaming}
      isThreadReady={isThreadReady}
      isCreatingThread={isCreatingThread}
      error={error}
    />
  );

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-app-bg">
      <header className="relative z-50 flex shrink-0 flex-wrap items-start justify-between gap-3 px-3 pb-1.5 pt-3 sm:px-5 sm:pt-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <button
            type="button"
            onClick={openSidebar}
            className="mt-0.5 rounded-lg p-1.5 text-ink-secondary hover:bg-surface-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1 pr-2">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Hello, {firstName}! 👋
            </h1>
            <p className="mt-0.5 max-w-2xl text-xs text-ink-secondary sm:text-sm">
              I&apos;m your AI-Powered Technical Support Agent. How can I help
              you today?
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:max-w-[360px] sm:shrink-0">
          <TopStatusBar />
          <button
            type="button"
            onClick={toggleChat}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-app-border bg-surface text-ink-secondary shadow-card transition hover:bg-surface-muted hover:text-ink xl:hidden',
              chatOpen && 'bg-brand-soft text-brand',
            )}
            aria-label={chatOpen ? 'Close chat' : 'Open chat'}
          >
            {chatOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <AgentWorkspace
            agent={agent}
            hideGreeting
            onPrompt={sendMessage}
            isAnalyzing={isStreaming || isCreatingThread}
            analyzeError={error}
          />
        </main>

        <aside className="hidden h-full min-h-0 w-chat shrink-0 flex-col overflow-hidden bg-app-bg p-2 pt-0 xl:flex 2xl:w-chat-lg">
          {chatPanel}
        </aside>

        <div
          className={cn(
            'absolute inset-0 z-30 bg-ink/30 transition-opacity xl:hidden',
            chatOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={closeChat}
          aria-hidden={!chatOpen}
        />
        <aside
          className={cn(
            'absolute inset-y-0 right-0 z-40 flex w-[min(100%,320px)] flex-col bg-app-bg p-2 shadow-panel transition-transform duration-200 xl:hidden',
            chatOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          {chatPanel}
        </aside>
      </div>
    </div>
  );
}
