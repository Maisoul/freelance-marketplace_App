import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, FormErrorMessage, useToast, Select } from '@chakra-ui/react';
import { useAuth } from '../../contexts/useAuth';

interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'expert';
}

export const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'client',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <Box as="form" onSubmit={handleSubmit} width="100%" maxW="400px" p={4}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={error?.field === 'email'}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          {error?.field === 'email' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={error?.field === 'password'}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          {error?.field === 'password' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={error?.field === 'firstName'}>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
          {error?.field === 'firstName' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={error?.field === 'lastName'}>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
          {error?.field === 'lastName' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={error?.field === 'role'}>
          <FormLabel>I want to</FormLabel>
          <Select name="role" value={formData.role} onChange={handleChange}>
            <option value="client">Hire an Expert</option>
            <option value="expert">Work as an Expert</option>
          </Select>
          {error?.field === 'role' && (
            <FormErrorMessage>{error.message}</FormErrorMessage>
          )}
        </FormControl>

        {error && !error.field && (
          <Box color="red.500" fontSize="sm">
            {error.message}
          </Box>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Creating account..."
          width="100%"
        >
          Create Account
        </Button>
      </VStack>
    </Box>
  );
};