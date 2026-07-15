import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/layout/AppSidebar';
import { LayoutProvider } from '../context/LayoutContext';

export function AppShell() {
  return (
    <LayoutProvider>
      <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-app-bg">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </LayoutProvider>
  );
}
