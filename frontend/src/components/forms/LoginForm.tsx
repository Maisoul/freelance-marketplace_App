import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, FormErrorMessage, useToast } from '@chakra-ui/react';
import { useAuth } from '../../contexts/useAuth';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  } catch {
      // Error is handled by the auth context and displayed in the form
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6} align="stretch">
        <FormControl isInvalid={error?.field === 'email'}>
          <FormLabel fontWeight="semibold" color="gray.700">Email Address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            size="lg"
            borderRadius="md"
            borderColor="gray.300"
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            required
          />
          {error?.field === 'email' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={error?.field === 'password'}>
          <FormLabel fontWeight="semibold" color="gray.700">Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            size="lg"
            borderRadius="md"
            borderColor="gray.300"
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            required
          />
          {error?.field === 'password' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        {error && !error.field && (
          <Box color="red.500" fontSize="sm" textAlign="center" p={2} bg="red.50" borderRadius="md">
            {error.message}
          </Box>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Logging in..."
          size="lg"
          width="100%"
          borderRadius="md"
          fontWeight="semibold"
          py={6}
        >
          Log In
        </Button>
      </VStack>
    </Box>
  );
};