import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Bot,
  FlaskConical,
  GitBranch,
  BookOpen,
  Settings2,
  Wand2,
  Ticket,
  Activity,
  Database,
  Library,
  X,
} from 'lucide-react';
import { agents } from '../../data/agents';
import { AppLogo } from '../brand/AppLogo';
import { useLayout } from '../../hooks/useLayout';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Assistant', path: '/assistant', icon: Wand2 },
  { label: 'Analysis Studio', path: '/analysis-studio', icon: FlaskConical },
  { label: 'Lineage Explorer', path: '/lineage', icon: GitBranch },
  { label: 'Knowledge Hub', path: '/knowledge-hub', icon: BookOpen },
  { label: 'Impact Simulator', path: '/impact-simulator', icon: Settings2 },
];

const agentIcons: Record<string, typeof Ticket> = {
  'ticket-analyzer': Ticket,
  'impact-analyzer': Activity,
  'data-issue-analyzer': Database,
  'knowledge-assistant': Library,
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { agentSlug } = useParams();
  const { sidebarOpen, closeSidebar } = useLayout();

  const isAssistant = location.pathname.startsWith('/assistant');
  const activeSlug = agentSlug ?? agents[0].slug;

  const go = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-ink/40 transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={cn(
          'flex h-full w-sidebar shrink-0 flex-col border-r border-app-border bg-surface',
          'fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between px-4">
          <AppLogo />
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-muted lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="min-h-0 shrink-0 overflow-y-auto px-2.5 scrollbar-thin">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active =
                item.path === '/assistant'
                  ? isAssistant
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={
                      item.path === '/assistant'
                        ? `/assistant/${activeSlug}`
                        : item.path
                    }
                    onClick={closeSidebar}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                      active
                        ? 'bg-brand-soft text-brand'
                        : 'text-ink-secondary hover:bg-surface-muted hover:text-ink',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        active ? 'text-brand' : 'text-ink-muted',
                      )}
                      strokeWidth={1.75}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mx-2.5 mt-4 shrink-0 overflow-hidden rounded-xl border border-brand/10 bg-gradient-to-b from-[#eef5ff] via-[#f5f9ff] to-white p-2.5 shadow-card">
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            AI Agents
          </p>
          <ul className="space-y-0.5">
            {agents.map((agent) => {
              const selected = agent.slug === activeSlug;
              const Icon = agentIcons[agent.slug] ?? Database;
              return (
                <li key={agent.id}>
                  <button
                    type="button"
                    onClick={() => go(`/assistant/${agent.slug}`)}
                    className={cn(
                      'relative flex w-full items-center gap-2 rounded-lg py-2 pl-2.5 pr-2 text-left text-[12px] transition-colors',
                      selected
                        ? 'bg-white font-medium text-brand shadow-card'
                        : 'text-ink-secondary hover:bg-white/70 hover:text-ink',
                    )}
                  >
                    {selected ? (
                      <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-brand" />
                    ) : null}
                    <Icon
                      className={cn(
                        'h-3.5 w-3.5 shrink-0',
                        selected ? 'text-brand' : 'text-ink-muted',
                      )}
                      strokeWidth={1.75}
                    />
                    <span className="min-w-0 flex-1 truncate">{agent.name}</span>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-success" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mx-2.5 mb-2.5 mt-auto overflow-hidden rounded-xl bg-gradient-to-b from-[#1e3a5f] via-[#1e4a7a] to-[#2563eb] p-3 text-ink-inverse shadow-card">
          <div className="mb-2 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Bot className="h-6 w-6 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-center text-xs font-semibold">Need help fast?</p>
          <p className="mt-0.5 text-center text-[11px] text-white/75">
            Ask our AI Assistant
          </p>
          <button
            type="button"
            onClick={() => go(`/assistant/${activeSlug}`)}
            className="mt-2.5 w-full rounded-lg bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            Start a conversation →
          </button>
        </div>
      </aside>
    </>
  );
}
