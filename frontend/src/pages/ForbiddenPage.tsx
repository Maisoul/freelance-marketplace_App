import { FC } from 'react';
import { Box, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import type { Role } from '../types/auth';

const DASHBOARD_PATHS: Record<Role, string> = {
  admin: '/admin/dashboard',
  client: '/client/dashboard',
  expert: '/expert/dashboard',
};

export const ForbiddenPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleBackToDashboard = () => {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = user?.role ? DASHBOARD_PATHS[user.role] : '/';

    navigate(dashboardPath);
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
      p={4}
    >
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl" color="red.500">
          403
        </Heading>
        <Heading size="xl">Access Forbidden</Heading>
        <Text fontSize="lg" maxW="md">
          Sorry, you don't have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </Button>
      </VStack>
    </Box>
  );
};