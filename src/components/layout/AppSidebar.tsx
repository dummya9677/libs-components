import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Home,
  Ticket,
  Activity,
  Database,
  Library,
  ShieldCheck,
  CircleDollarSign,
  X,
} from 'lucide-react';
import { agents } from '../../data/agents';
import { BrandLockup } from '../brand/BrandLockup';
import { PromoGradientCard, promoImages } from '../promo/PromoGradientCard';
import { useLayout } from '../../hooks/useLayout';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Homepage', path: '/', icon: Home },
];

const agentIcons: Record<string, typeof Ticket> = {
  'data-quality-intelligence': ShieldCheck,
  'ticket-intelligence': Ticket,
  'data-intelligence': Database,
  'impact-intelligence': Activity,
  'knowledge-intelligence': Library,
  'cost-intelligence': CircleDollarSign,
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { agentSlug } = useParams();
  const { sidebarOpen, closeSidebar } = useLayout();

  const isHomepage =
    location.pathname === '/' || location.pathname === '/home';
  const isOnAgentPage = location.pathname.startsWith('/assistant');
  const activeSlug = agentSlug;

  const go = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[100] bg-ink/40 transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={cn(
          'flex h-full w-sidebar shrink-0 flex-col overflow-hidden border-r border-app-border bg-surface',
          'fixed inset-y-0 left-0 z-[110] transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-1 border-b border-app-border/60 px-3">
          <BrandLockup className="min-w-0 flex-1" />
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-muted lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain scrollbar-thin">
          <nav className="shrink-0 px-2.5 pt-2.5">
            <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active =
                item.path === '/'
                  ? isHomepage
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                      active
                        ? 'bg-client-cyan-10 text-client-blue-helix-dark'
                        : 'text-ink-secondary hover:bg-surface-muted hover:text-ink',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        active ? 'text-client-cyan-helix-light' : 'text-ink-muted',
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

          <div className="mx-2.5 mt-4 shrink-0 overflow-hidden rounded-xl border border-client-cyan-30/30 bg-gradient-to-b from-client-cyan-10 via-white to-white p-2.5 shadow-card">
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            AI Agents
          </p>
          <ul className="space-y-0.5">
            {agents.map((agent) => {
              const selected = isOnAgentPage && agent.slug === activeSlug;
              const Icon = agentIcons[agent.slug] ?? Database;
              return (
                <li key={agent.id}>
                  <button
                    type="button"
                    onClick={() => go(`/assistant/${agent.slug}`)}
                    className={cn(
                      'relative flex w-full items-center gap-2 rounded-lg py-2 pl-2.5 pr-2 text-left text-[12px] transition-colors',
                      selected
                        ? 'bg-white font-medium text-client-blue-helix-dark shadow-card'
                        : 'text-ink-secondary hover:bg-white/70 hover:text-ink',
                    )}
                  >
                    {selected ? (
                      <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-client-cyan-helix-light" />
                    ) : null}
                    <Icon
                      className={cn(
                        'h-3.5 w-3.5 shrink-0',
                        selected ? 'text-client-cyan-helix-light' : 'text-ink-muted',
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

        <div className="mx-2.5 mb-2.5 mt-4 shrink-0">
          <PromoGradientCard
            variant="sidebar"
            title="Need help fast?"
            description="Ask our AI Assistant"
            imageUrl={promoImages.sidebarAssistant}
            imageAlt="AI assistant illustration"
            placeholderLabel="Add PNG to public/images/sidebar-assistant-promo.png"
            action={{
              label: 'Start a conversation →',
              onClick: () => go(`/assistant/${agents[0].slug}`),
            }}
          />
        </div>
        </div>
      </aside>
    </>
  );
}
