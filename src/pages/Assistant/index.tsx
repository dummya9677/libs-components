import { MessageSquare, Menu, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getAgentBySlug } from '../../data/agents';
import { AgentComingSoon } from '../../components/agent/AgentComingSoon';
import { AgentWorkspace } from '../../components/agent/AgentWorkspace';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { ResizableChatAside } from '../../components/layout/ResizableChatAside';
import { TopStatusBar } from '../../components/layout/TopStatusBar';
import { useAgentChat } from '../../hooks/useAgentChat';
import { useAuth } from '../../hooks/useAuth';
import { useLayout } from '../../hooks/useLayout';
import { useResizableWidth } from '../../hooks/useResizableWidth';
import { useValidatedSelectedApplication } from '../../hooks/useValidatedSelectedApplication';
import type { AgentDefinition } from '../../data/agents';
import { cn } from '../../utils/cn';

interface AssistantLocationState {
  initialPrompt?: string;
}

function AssistantPageContent({ agent }: { agent: AgentDefinition }) {
  const location = useLocation();
  const { user } = useAuth();
  const { toggleSidebar, chatOpen, toggleChat, closeChat, openChat } = useLayout();
  const { width: chatWidth, isResizing, startResize } = useResizableWidth();
  const {
    applicationName,
    setApplicationName,
    validApplication,
  } = useValidatedSelectedApplication(agent.slug);
  const firstName = user?.name?.split(' ')[0] ?? 'John';
  const initialPromptSent = useRef(false);

  const {
    isCreatingThread,
    isThreadReady,
    needsApplication,
    messages,
    hasMoreHistory,
    isLoadingOlderMessages,
    loadOlderMessages,
    isStreaming,
    error,
    sendMessage,
  } = useAgentChat(agent.id, applicationName || null);

  useEffect(() => {
    const state = location.state as AssistantLocationState | null;
    const prompt = state?.initialPrompt?.trim();
    if (!prompt || initialPromptSent.current || !isThreadReady) return;

    initialPromptSent.current = true;
    void sendMessage(prompt);
  }, [isThreadReady, location.state, sendMessage]);

  // Reset chat panel when entering/leaving the assistant so Edge does not keep
  // stale flex/transform state after toggling chat and navigating away.
  useEffect(() => {
    const desktopChat = window.matchMedia('(min-width: 1280px)');
    if (desktopChat.matches) {
      openChat();
    }

    return () => {
      closeChat();
    };
  }, [openChat, closeChat]);

  const chatPanel = (
    <ChatPanel
      agent={agent}
      messages={messages}
      onSend={sendMessage}
      isStreaming={isStreaming}
      isThreadReady={isThreadReady}
      isCreatingThread={isCreatingThread}
      needsApplication={needsApplication}
      error={error}
      hasMoreHistory={hasMoreHistory}
      isLoadingOlderMessages={isLoadingOlderMessages}
      onLoadOlderMessages={loadOlderMessages}
    />
  );

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-app-bg">
      <header className="relative z-50 flex shrink-0 flex-wrap items-start justify-between gap-3 px-3 pb-1.5 pt-3 sm:px-5 sm:pt-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            className="relative z-[120] mt-0.5 rounded-lg p-1.5 text-ink-secondary hover:bg-surface-muted lg:z-auto lg:hidden"
            aria-label="Toggle menu"
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
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-app-border bg-surface text-ink-secondary shadow-card transition hover:bg-surface-muted hover:text-ink',
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

      <div className="relative flex min-h-0 w-full flex-1 overflow-hidden">
        <main className="relative z-0 flex min-h-0 min-w-0 flex-1 basis-0 flex-col overflow-hidden">
          <AgentWorkspace
            agent={agent}
            onPrompt={sendMessage}
            applicationName={applicationName}
            onApplicationChange={setApplicationName}
            selectedApplicationName={validApplication?.name}
          />
        </main>

        {chatOpen ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-30 bg-ink/30 xl:hidden"
              aria-hidden
            />
            <ResizableChatAside
              width={chatWidth}
              isResizing={isResizing}
              onResizeStart={startResize}
              className={cn(
                'absolute inset-y-0 right-0 z-40 max-w-full shrink-0 border-l border-app-border shadow-panel',
                'xl:static xl:shadow-none',
                isResizing && 'transition-none',
              )}
            >
              {chatPanel}
            </ResizableChatAside>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function AssistantPage() {
  const { agentSlug } = useParams();
  const agent = getAgentBySlug(agentSlug);

  if (agent.comingSoon) {
    return (
      <AgentComingSoon
        name={agent.name}
        description={agent.description}
        colorKey={agent.colorKey}
        slug={agent.slug}
      />
    );
  }

  return <AssistantPageContent agent={agent} />;
}
