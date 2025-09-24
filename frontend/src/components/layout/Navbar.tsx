import {
  Box,
  Flex,
  HStack,
  Button,
  Spacer,
  useColorModeValue,
  Image,
  Heading,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogoClick = () => {
    // Admin login via logo click
    navigate('/admin/login');
  };

  return (
    <Box bg={bg} px={4} boxShadow="sm" borderBottom="1px" borderColor={borderColor}>
      <Flex h={16} alignItems="center" maxW="7xl" mx="auto">
        <HStack spacing={4} alignItems="center">
          <HStack
            spacing={3}
            cursor="pointer"
            onClick={handleLogoClick}
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s"
          >
            <Image src="/vite.svg" alt="Mai-Guru Logo" boxSize="40px" />
            <Heading size="md" color="blue.600">
              Mai-Guru
            </Heading>
          </HStack>
        </HStack>
        
        <Spacer />
        
        <HStack spacing={4}>
          {!isAuthenticated ? (
            <Button as={Link} to="/auth" colorScheme="blue">
              Get Started
            </Button>
          ) : (
            <>
              {user?.role === 'client' && (
                <Button as={Link} to="/client/dashboard" colorScheme="blue">
                  Dashboard
                </Button>
              )}
              {user?.role === 'expert' && (
                <Button as={Link} to="/expert/dashboard" colorScheme="green">
                  Dashboard
                </Button>
              )}
              {user?.role === 'admin' && (
                <Button as={Link} to="/admin/dashboard" colorScheme="purple">
                  Admin
                </Button>
              )}
              <Button onClick={logout} variant="outline" colorScheme="red">
                Logout
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}