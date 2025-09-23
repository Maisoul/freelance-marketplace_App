import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '../../contexts/useAuth';
import type { FC, ReactNode } from 'react';
import type { Role } from '../../types/auth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
}

const DASHBOARD_ROUTES: Record<Role, string> = {
  admin: '/admin/dashboard',
  client: '/client/dashboard',
  expert: '/expert/dashboard',
};

export const RoleGuard: FC<RoleGuardProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  if (!isAuthenticated || !user) {
    // Save the attempted url for redirection after login
    const params = new URLSearchParams();
    params.append('redirect', location.pathname + location.search);
    return <Navigate to={`/auth?${params.toString()}`} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
  const dashboardRoute = DASHBOARD_ROUTES[user.role as keyof typeof DASHBOARD_ROUTES];
    return <Navigate to={dashboardRoute} replace />;
  }

  return <>{children}</>;
};