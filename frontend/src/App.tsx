import { ChakraProvider, Box } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import { AuthPage } from './pages/AuthPage';
import type { FC, ReactNode } from 'react';
import React, { Suspense } from 'react';

// Import components with type assertions
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const TaskDetails = React.lazy(() => import('./pages/TaskDetails'));
const ExpertInviteAccept = React.lazy(() => import('./pages/ExpertInviteAccept'));

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
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
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

