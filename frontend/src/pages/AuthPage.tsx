import { useState } from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Button } from '@chakra-ui/react';
import { LoginForm } from '../components/forms/LoginForm';
import { RegisterForm } from '../components/forms/RegisterForm';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading mb={2}>{isLogin ? 'Welcome Back!' : 'Create an Account'}</Heading>
          <Text color="gray.600">
            {isLogin
              ? 'Log in to access your account'
              : 'Join our community of experts and clients'}
          </Text>
        </Box>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <HStack justify="center" spacing={2}>
          <Text>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};