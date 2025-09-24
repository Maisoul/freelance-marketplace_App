import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardBody,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Alert,
  AlertIcon,
  Image,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use the specific admin email and provided password
      await login('admin@maiguru.com', password);
      
      toast({
        title: 'Login Successful',
        description: 'Welcome to Mai-Guru Admin Dashboard',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      setError('Invalid password. Please try again.');
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please check your password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, blue.50, white)" display="flex" alignItems="center">
      <Container maxW="md">
        <Card shadow="2xl">
          <CardBody p={8}>
            <VStack spacing={6}>
              {/* Logo and Title */}
              <VStack spacing={4}>
                <HStack spacing={3}>
                  <Image src="/vite.svg" alt="Mai-Guru Logo" boxSize="48px" />
                  <Heading size="lg" color="blue.600">
                    Mai-Guru
                  </Heading>
                </HStack>
                <VStack spacing={2}>
                  <Heading size="md" color="gray.700">
                    Admin Portal
                  </Heading>
                  <Text color="gray.600" textAlign="center">
                    Access the administrative dashboard for Mai-Guru platform
                  </Text>
                </VStack>
              </VStack>

              {/* Login Form */}
              <Box w="full">
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!error}>
                      <FormLabel>Admin Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        size="lg"
                        required
                      />
                      <FormErrorMessage>{error}</FormErrorMessage>
                    </FormControl>

                    {error && (
                      <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      w="full"
                      isLoading={isLoading}
                      loadingText="Signing in..."
                    >
                      Access Admin Dashboard
                    </Button>
                  </VStack>
                </form>
              </Box>

              {/* Security Notice */}
              <Box w="full" p={4} bg="yellow.50" borderRadius="md" border="1px" borderColor="yellow.200">
                <Text fontSize="sm" color="yellow.800" textAlign="center">
                  <strong>Security Notice:</strong> This is a restricted area. 
                  Only authorized administrators should access this portal.
                </Text>
              </Box>

              {/* Back to Home */}
              <Button
                variant="link"
                colorScheme="blue"
                onClick={() => navigate('/')}
                size="sm"
              >
                ← Back to Home
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
