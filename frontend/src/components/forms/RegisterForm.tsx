import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, FormErrorMessage, useToast } from '@chakra-ui/react';
import { useAuth } from '../../contexts/useAuth';
import type { RegisterData } from '../../contexts/AuthContext.types';

export const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    password_confirm: '',
    firstName: '',
    lastName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await register(formData);
      toast({
        title: 'Registration successful',
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
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
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

        <FormControl isInvalid={error?.field === 'password_confirm'}>
          <FormLabel fontWeight="semibold" color="gray.700">Confirm Password</FormLabel>
          <Input
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            placeholder="Confirm your password"
            size="lg"
            borderRadius="md"
            borderColor="gray.300"
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            required
          />
          {error?.field === 'password_confirm' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={error?.field === 'firstName'}>
          <FormLabel fontWeight="semibold" color="gray.700">First Name</FormLabel>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            size="lg"
            borderRadius="md"
            borderColor="gray.300"
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            required
          />
          {error?.field === 'firstName' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={error?.field === 'lastName'}>
          <FormLabel fontWeight="semibold" color="gray.700">Last Name</FormLabel>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            size="lg"
            borderRadius="md"
            borderColor="gray.300"
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            required
          />
          {error?.field === 'lastName' && (
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
          loadingText="Creating account..."
          size="lg"
          width="100%"
          borderRadius="md"
          fontWeight="semibold"
          py={6}
        >
          Create Account
        </Button>
      </VStack>
    </Box>
  );
};