import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, FormErrorMessage, useToast, Text } from '@chakra-ui/react';
import { useAuth } from '../../contexts/useAuth';
import type { RegisterData } from '../../contexts/AuthContext.types';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    password_confirm: '',
    firstName: '',
    lastName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const toast = useToast();

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('At least one capital letter');
    }
    
    if (!/(?=.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?])/.test(password)) {
      errors.push('At least one symbol');
    }
    
    if (!/(?=.*[0-9])/.test(password)) {
      errors.push('At least one number');
    }
    
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate password in real-time
    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
      
      // Check password match if confirm password is not empty
      if (formData.password_confirm && value !== formData.password_confirm) {
        setPasswordMatchError('Passwords do not match');
      } else if (formData.password_confirm && value === formData.password_confirm) {
        setPasswordMatchError('');
      }
    }

    // Validate password match in real-time
    if (name === 'password_confirm') {
      if (value !== formData.password) {
        setPasswordMatchError('Passwords do not match');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const passwordValidationErrors = validatePassword(formData.password);
    setPasswordErrors(passwordValidationErrors);
    
    if (formData.password !== formData.password_confirm) {
      setPasswordMatchError('Passwords do not match');
      return;
    }
    
    if (passwordValidationErrors.length > 0) {
      toast({
        title: 'Password requirements not met',
        description: 'Please check the password requirements',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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

  const isPasswordValid = passwordErrors.length === 0 && formData.password.length > 0;
  const isPasswordMatchValid = !passwordMatchError && formData.password_confirm.length > 0;

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretched">
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

        <FormControl isInvalid={passwordErrors.length > 0 && formData.password.length > 0}>
          <FormLabel fontWeight="semibold" color="gray.700">Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            size="lg"
            borderRadius="md"
            borderColor={isPasswordValid ? 'green.500' : passwordErrors.length > 0 ? 'red.500' : 'gray.300'}
            _focus={{ borderColor: isPasswordValid ? 'green.500' : 'blue.500', boxShadow: `0 0 0 1px ${isPasswordValid ? '#38A169' : '#3182ce'}` }}
            required
          />
          {formData.password.length > 0 && (
            <Box mt={2}>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Password must contain:
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color={formData.password.length >= 8 ? 'green.500' : 'red.500'}>
                  ✓ At least 8 characters {formData.password.length >= 8 ? '✓' : ''}
                </Text>
                <Text fontSize="sm" color={/(?=.*[A-Z])/.test(formData.password) ? 'green.500' : 'red.500'}>
                  ✓ At least one capital letter {/(?=.*[A-Z])/.test(formData.password) ? '✓' : ''}
                </Text>
                <Text fontSize="sm" color={/(?=.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?])/.test(formData.password) ? 'green.500' : 'red.500'}>
                  ✓ At least one symbol {/(?=.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?])/.test(formData.password) ? '✓' : ''}
                </Text>
                <Text fontSize="sm" color={/(?=.*[0-9])/.test(formData.password) ? 'green.500' : 'red.500'}>
                  ✓ At least one number {/(?=.*[0-9])/.test(formData.password) ? '✓' : ''}
                </Text>
              </VStack>
            </Box>
          )}
          {passwordErrors.length > 0 && formData.password.length > 0 && (
            <FormErrorMessage>Password does not meet requirements</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={passwordMatchError.length > 0 && formData.password_confirm.length > 0}>
          <FormLabel fontWeight="semibold" color="gray.700">Confirm Password</FormLabel>
          <Input
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            placeholder="Confirm your password"
            size="lg"
            borderRadius="md"
            borderColor={isPasswordMatchValid ? 'green.500' : passwordMatchError ? 'red.500' : 'gray.300'}
            _focus={{ borderColor: isPasswordMatchValid ? 'green.500' : 'blue.500', boxShadow: `0 0 0 1px ${isPasswordMatchValid ? '#38A169' : '#3182ce'}` }}
            required
          />
          {passwordMatchError && formData.password_confirm.length > 0 && (
            <FormErrorMessage>{passwordMatchError}</FormErrorMessage>
          )}
          {isPasswordMatchValid && (
            <Text fontSize="sm" color="green.500" mt={1}>
              ✓ Passwords match
            </Text>
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
          isDisabled={passwordErrors.length > 0 || passwordMatchError.length > 0}
        >
          Create Account
        </Button>
        {/* Back to Home */}
        <Button
                variant="link"
                colorScheme="red"
                onClick={() => navigate('/')}
                size="sm"
              >
                ← Back to Home
              </Button>
      </VStack>
    </Box>
  );
};