import { useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Button, 
  Card, 
  CardBody,
  useColorModeValue,
  Image,
  Divider
} from '@chakra-ui/react';
import { LoginForm } from '../components/forms/LoginForm';
import { RegisterForm } from '../components/forms/RegisterForm';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box minH="100vh" bgGradient={bgGradient} display="flex" justifyContent="center" alignItems="center" marginLeft="280" width="100%">
      <Container maxW="lg" py={10} centerContent>
        <Card shadow="2xl" bg={cardBg} borderColor={borderColor} width="100%">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              {/* Logo and Header */}
              <VStack spacing={4} textAlign="center">
                <HStack spacing={3}>
                  <Image src="/vite.svg" alt="Mai-Guru Logo" boxSize="48px" />
                  <Heading size="lg" color="blue.600">
                    Mai-Guru
                  </Heading>
                </HStack>
                <VStack spacing={2}>
                  <Heading size="md" color="gray.700">
                    {isLogin ? 'Welcome Back!' : 'Create an Account'}
                  </Heading>
                  <Text color="gray.600">
                    {isLogin
                      ? 'Log in to access your client dashboard'
                      : 'Join our community and start your project'}
                  </Text>
                </VStack>
              </VStack>

              <Divider />

              {/* Forms */}
              {isLogin ? <LoginForm /> : <RegisterForm />}

              <Divider />

              {/* Toggle */}
              <HStack justify="center" spacing={2}>
                <Text color="gray.600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </Text>
                <Button
                  variant="link"
                  colorScheme="blue"
                  onClick={() => setIsLogin(!isLogin)}
                  fontWeight="semibold"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </Button>
              </HStack>

              {/* Expert Notice */}
              {!isLogin && (
                <Box p={4} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <Text fontSize="sm" color="blue.800" textAlign="center">
                    <strong>For Experts:</strong> Expert accounts are created by invitation only. 
                    Contact our admin team to join as an expert.
                  </Text>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};