import { ChakraProvider, Box } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import { AuthPage } from './pages/AuthPage';
import { RoleGuard } from './components/guards/RoleGuard';
import type { FC, ReactNode } from 'react';
import React, { Suspense } from 'react';

// Import components with type assertions
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const TaskDetails = React.lazy(() => import('./pages/TaskDetails'));
const ExpertInviteAccept = React.lazy(() => import('./pages/ExpertInviteAccept'));
const ClientDashboard = React.lazy(() => import('./pages/client/Dashboard'));
const ExpertDashboard = React.lazy(() => import('./pages/expert/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));

// Protected route component
const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};


const App: FC = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Box minH="100vh">
          <Suspense fallback={<Box p={4}>Loading...</Box>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/client/dashboard"
                element={
                  <RoleGuard allowedRoles={['client']}>
                    <ClientDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/expert/dashboard"
                element={
                  <RoleGuard allowedRoles={['expert']}>
                    <ExpertDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/task/:id"
                element={
                  <ProtectedRoute>
                    <TaskDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invite/:token"
                element={
                  <ProtectedRoute>
                    <ExpertInviteAccept />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;

