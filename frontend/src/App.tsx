import { ChakraProvider, Box } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import { AuthPage } from './pages/AuthPage';
import { RoleGuard } from './components/guards/RoleGuard';
import type { FC, ReactNode } from 'react';
import React, { Suspense } from 'react';

// Import components with type assertions
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const TaskDetails = React.lazy(() => import('./pages/TaskDetails'));
const ExpertInviteAccept = React.lazy(() => import('./pages/ExpertInviteAccept'));
const ClientDashboard = React.lazy(() => import('./pages/client/Dashboard'));
const ExpertDashboard = React.lazy(() => import('./pages/expert/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));

// Protected route component
const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Box>Loading...</Box>;
  }
import React from 'react';
  import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Icon,
    Image,
    Link,
    ListItem,
    SimpleGrid,
    Stack,
    Text,
    UnorderedList,
    VStack,
    useColorModeValue,
    Divider,
    Tag,
    Center,
  } from '@chakra-ui/react';
  import { Link as RouterLink, useNavigate } from 'react-router-dom';
  import { FaLinkedin } from 'react-icons/fa';

  const ServiceCard: React.FC<{ title: string; description?: string; items?: string[] }> = ({
    title,
    description,
    items = [],
  }) => {
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    return (
      <Box
        borderWidth="1px"
        borderColor={borderColor}
        bg={cardBg}
        borderRadius="lg"
        p={6}
        shadow="sm"
        _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
        transition="all 0.2s ease"
      >
        <Heading size="md" mb={2} color={useColorModeValue('blue.700', 'blue.300')}>
          {title}
        </Heading>
        {description && (
          <Text mb={3} color={useColorModeValue('gray.700', 'gray.300')}>
            {description}
          </Text>
        )}
        {items.length > 0 && (
          <UnorderedList spacing={2} color={useColorModeValue('gray.700', 'gray.300')}>
            {items.map((item, idx) => (
              <ListItem key={idx}>{item}</ListItem>
            ))}
          </UnorderedList>
        )}
      </Box>
    );
  };

  const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const bgGradient = useColorModeValue(
      'linear(to-b, blue.50, white)',
      'linear(to-b, gray.900, gray.800)'
    );

    const sectionHeadingColor = useColorModeValue('gray.800', 'whiteAlpha.900');
    const subtleText = useColorModeValue('gray.600', 'gray.300');

    return (
      <Box minH="100vh" bgGradient={bgGradient}>
        {/* Hero / Header */}
        <Box pt={{ base: 10, md: 16 }} pb={{ base: 8, md: 12 }}>
          <Container maxW="6xl">
            <HStack justify="space-between" align="center" mb={8}>
              {/* Logo acts as Admin login button */}
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/login')}
                title="Admin Login"
                aria-label="Admin Login"
                _hover={{ bg: useColorModeValue('blue.100', 'whiteAlpha.200') }}
              >
                <HStack>
                  <Image src="/vite.svg" alt="Freelance Marketplace Logo" boxSize="40px" />
                  <Heading size="md" color={useColorModeValue('blue.700', 'blue.300')}>
                    Freelance Marketplace
                  </Heading>
                </HStack>
              </Button>

              <Button as={RouterLink} to="/auth" colorScheme="blue" variant="solid">
                Sign In
              </Button>
            </HStack>

            <Center>
              <VStack spacing={4} textAlign="center" maxW="3xl">
                <Heading size="2xl" color={sectionHeadingColor}>
                  Tell a Friend to Tell a Friend 🙂
                </Heading>
                <HStack spacing={2}>
                  <Tag colorScheme="blue" size="lg" variant="subtle">
                    Integrity
                  </Tag>
                  <Tag colorScheme="green" size="lg" variant="subtle">
                    Quality
                  </Tag>
                  <Tag colorScheme="purple" size="lg" variant="subtle">
                    Prompt
                  </Tag>
                </HStack>
                <Text fontSize="lg" color={subtleText}>
                  Building secure, intelligent, and scalable solutions across Web, AI, Security, and Writing.
                </Text>
                <HStack spacing={4} pt={2}>
                  <Button colorScheme="blue" size="lg" as={RouterLink} to="/auth">
                    WORK with US
                  </Button>
                  <Button variant="outline" size="lg" as={RouterLink} to="/auth">
                    Get Started
                  </Button>
                </HStack>
              </VStack>
            </Center>
          </Container>
        </Box>

        <Divider />

        {/* Services */}
        <Box py={{ base: 10, md: 16 }}>
          <Container maxW="6xl">
            <VStack align="stretch" spacing={6}>
              <Heading size="lg" color={sectionHeadingColor}>
                Services
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
                <ServiceCard
                  title="Web Development"
                  description="Full stack apps, APIs, and custom software."
                  items={[
                    'Programming - React, Node.js, Python Django',
                    'Front end technologies',
                    'Back end development',
                  ]}
                />
                <ServiceCard
                  title="AI & Machine Learning"
                  description="AI agents, chatbots, automation, and intelligent systems."
                  items={['AI Agents', 'Chatbots', 'Automation', 'NLP', 'Workflows']}
                />
                <ServiceCard
                  title="Cybersecurity"
                  items={[
                    'Security Analysts',
                    'Auditors',
                    'Vulnerability Assessors',
                    'Penetration Testers',
                    'Security Operations',
                    'Incident Responders',
                    'Forensic Investigators',
                    'Ethical Hacking',
                  ]}
                />
                <ServiceCard
                  title="Writing"
                  items={['Academic Writing', 'Technical Writing', 'Articles', 'Essays']}
                />
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        <Divider />

        {/* CEO / Leadership */}
        <Box py={{ base: 10, md: 16 }}>
          <Container maxW="5xl">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={8}
              align="center"
              justify="space-between"
            >
              <Image
                src="/ceo.JPG"
                alt="CEO"
                boxSize={{ base: '160px', md: '200px' }}
                borderRadius="full"
                objectFit="cover"
                border="4px solid"
                borderColor={useColorModeValue('blue.100', 'whiteAlpha.300')}
                shadow="md"
              />
              <VStack align="start" spacing={4} flex="1">
                <Heading size="lg" color={sectionHeadingColor}>
                  Leadership
                </Heading>
                <Text color={subtleText}>
                  Meet our CEO—driving excellence in delivery, security, and innovation.
                </Text>
                <HStack spacing={4} flexWrap="wrap">
                  <Button as={RouterLink} to="/auth" colorScheme="blue" variant="solid">
                    View Profile
                  </Button>
                  <Link href="https://www.linkedin.com" isExternal _hover={{ textDecoration: 'none' }}>
                    <Button leftIcon={<Icon as={FaLinkedin} />} variant="outline" colorScheme="linkedin">
                      LinkedIn
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            </Stack>
          </Container>
        </Box>

        <Divider />

        {/* CTA */}
        <Box py={{ base: 10, md: 16 }}>
          <Container maxW="6xl">
            <VStack spacing={4} textAlign="center">
              <Heading size="lg" color={sectionHeadingColor}>
                Ready to Launch Your Next Project?
              </Heading>
              <Text color={subtleText}>
                Get started in minutes and work with top experts.
              </Text>
              <Button size="lg" colorScheme="blue" as={RouterLink} to="/auth">
                WORK with US
              </Button>
            </VStack>
          </Container>
        </Box>

        {/* Footer */}
        <Box py={8} borderTopWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <Container maxW="6xl">
            <Text fontSize="sm" color={subtleText} textAlign="center">
              © 2025 Freelance Marketplace. All rights reserved.
            </Text>
          </Container>
        </Box>
      </Box>
    );
  };

  export default LandingPage;
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};


const App: FC = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Box minH="100vh">
          <Suspense fallback={<Box p={4}>Loading...</Box>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/client/dashboard"
                element={
                  <RoleGuard allowedRoles={['client']}>
                    <ClientDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/expert/dashboard"
                element={
                  <RoleGuard allowedRoles={['expert']}>
                    <ExpertDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/task/:id"
                element={
                  <ProtectedRoute>
                    <TaskDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invite/:token"
                element={
                  <ProtectedRoute>
                    <ExpertInviteAccept />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;

