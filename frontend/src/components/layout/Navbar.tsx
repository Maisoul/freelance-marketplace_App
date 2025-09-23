import { Box, Flex, HStack, Button, Spacer, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Box bg="white" px={4} boxShadow="sm">
      <Flex h={16} alignItems="center">
        <HStack spacing={8} alignItems="center">
          <ChakraLink as={Link} to="/" fontWeight="bold" fontSize="xl">
            Freelance Marketplace
          </ChakraLink>
        </HStack>
        <Spacer />
        <HStack spacing={4}>
          {!isAuthenticated && <Button as={Link} to="/auth" colorScheme="blue">Login</Button>}
          {isAuthenticated && user?.role === 'client' && (
            <Button as={Link} to="/client/dashboard" colorScheme="blue">Dashboard</Button>
          )}
          {isAuthenticated && user?.role === 'expert' && (
            <Button as={Link} to="/expert/dashboard" colorScheme="green">Dashboard</Button>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Button as={Link} to="/admin/dashboard" colorScheme="purple">Admin</Button>
          )}
          {isAuthenticated && <Button onClick={logout} colorScheme="red">Logout</Button>}
        </HStack>
      </Flex>
    </Box>
  );
}
