import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/Login';
import { AuthCallbackPage } from '@/pages/AuthCallback';
import { AssistantPage } from '@/pages/Assistant';
import { PlaceholderPage } from '@/pages/Placeholder';
import { NotFoundPage } from '@/pages/NotFound';
import { DEFAULT_AGENT_SLUG } from '@/data/agents';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={`/assistant/${DEFAULT_AGENT_SLUG}`} replace /> },
      { path: 'assistant', element: <Navigate to={`/assistant/${DEFAULT_AGENT_SLUG}`} replace /> },
      { path: 'assistant/:agentSlug', element: <AssistantPage /> },
      {
        path: 'analysis-studio',
        element: <PlaceholderPage title="Analysis Studio" />,
      },
      { path: 'lineage', element: <PlaceholderPage title="Lineage Explorer" /> },
      {
        path: 'knowledge-hub',
        element: <PlaceholderPage title="Knowledge Hub" />,
      },
      {
        path: 'impact-simulator',
        element: <PlaceholderPage title="Impact Simulator" />,
      },
      { path: 'history', element: <Navigate to={`/assistant/${DEFAULT_AGENT_SLUG}`} replace /> },
      { path: 'settings', element: <PlaceholderPage title="Settings" /> },
    ],
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/404" replace /> },
]);
