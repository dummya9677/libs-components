import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Loader } from '../Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isLoading, permissions, roles } = useAppSelector(
    (state) => state.auth,
  );

  if (isLoading) {
    return <Loader fullScreen message="Checking session…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const missingPermission = requiredPermissions.some(
    (p) => !permissions.includes(p) && !permissions.includes('all'),
  );
  const missingRole =
    requiredRoles.length > 0 &&
    !requiredRoles.some((r) => roles.includes(r));

  if (missingPermission || missingRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
