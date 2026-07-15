import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-5xl font-bold text-ink">404</p>
      <p className="text-ink-secondary">Page not found</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Back to Assistant
      </button>
    </div>
  );
}
