import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLayout } from '../../hooks/useLayout';

export function PlaceholderPage({ title }: { title: string }) {
  const { toggleSidebar } = useLayout();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 px-3 pt-3 lg:hidden">
        <button
          type="button"
          onClick={toggleSidebar}
          className="relative z-[120] rounded-lg p-1.5 text-ink-secondary hover:bg-surface-muted lg:z-auto"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md rounded-2xl border border-app-border bg-surface p-6 text-center shadow-card sm:p-8">
          <h1 className="text-lg font-bold text-ink sm:text-xl">{title}</h1>
          <p className="mt-2 text-sm text-ink-secondary">
            This module is coming soon. Use Assistant to explore the AI agents.
          </p>
          <Link
            to="/assistant/ticket-intelligence"
            className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Go to Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
