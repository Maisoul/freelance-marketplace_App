import { useAuth } from './useAuth';
import type { Role } from '../types/auth';

interface UsePermissionsReturn {
  hasRole: (roles: Role[]) => boolean;
  isAdmin: boolean;
  isExpert: boolean;
  isClient: boolean;
  canEditTask: (taskOwnerId: string) => boolean;
  canManageUsers: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (roles: Role[]): boolean => {
    return isAuthenticated && user ? roles.includes(user.role) : false;
  };

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isExpert = isAuthenticated && user?.role === 'expert';
  const isClient = isAuthenticated && user?.role === 'client';

  const canEditTask = (taskOwnerId: string): boolean => {
    if (!user || !isAuthenticated) return false;
    
    // Admins can edit all tasks
    if (isAdmin) return true;
    
    // Users can edit their own tasks
    return user.id === taskOwnerId;
  };

  const canManageUsers = isAdmin;

  return {
    hasRole,
    isAdmin,
    isExpert,
    isClient,
    canEditTask,
    canManageUsers,
  };
};