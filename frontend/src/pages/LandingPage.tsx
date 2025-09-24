import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Badge,
  Card,
  CardBody,
  Icon,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckIcon, StarIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import CEOSection from '../components/layout/CEOSection';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    document.title = 'Mai-Guru: AI-Powered Freelance Platform | Tell a Friend to Tell a Friend';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Mai-Guru: Your AI-powered freelance platform connecting students and organizations with elite tech experts. Integrity, Quality & Prompt service for Web Development, AI/ML, Cybersecurity, and Technical Writing.'
      );
    } else {
      const tag = document.createElement('meta');
      tag.name = 'description';
      tag.content =
        'Mai-Guru: Your AI-powered freelance platform connecting students and organizations with elite tech experts. Integrity, Quality & Prompt service for Web Development, AI/ML, Cybersecurity, and Technical Writing.';
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <Box minH="100vh" bgGradient={bgGradient} color={textColor}>
      <Navbar />
      <Container maxW="7xl" py={{ base: 8, md: 16 }}>
        {/* Hero Section */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} alignItems="center" mb={20}>
          <VStack align="start" spacing={6}>
            <Badge colorScheme="blue" px={4} py={2} borderRadius="full" fontSize="sm">
              Integrity, Quality & Prompt Service
            </Badge>
            <Heading as="h1" size="2xl" lineHeight="1.2" color="blue.600">
              Tell a Friend to Tell a Friend 🙂
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              Your AI-powered freelance platform connecting students and organizations with elite tech experts. 
              Get competitive pricing, real-time project management, and exceptional results.
            </Text>
            <HStack spacing={4}>
              <Button
                as={Link}
                to="/auth"
                colorScheme="blue"
                size="lg"
                px={8}
                py={6}
                fontSize="lg"
              >
                Start Your Project
              </Button>
              <Button
                as={Link}
                to="/auth"
                variant="outline"
                colorScheme="blue"
                size="lg"
                px={8}
                py={6}
                fontSize="lg"
              >
                Get Started
              </Button>
            </HStack>
          </VStack>
          <Box>
            <Image
              src="/hero-tech.png"
              alt="Mai-Guru Platform"
              w="100%"
              borderRadius="lg"
              shadow="2xl"
            />
          </Box>
        </SimpleGrid>

        {/* KPI Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={20}>
          <Card bg={cardBg} borderColor={borderColor} shadow="lg">
            <CardBody textAlign="center" py={8}>
              <Heading size="2xl" color="blue.500" mb={2}>
                1000+
              </Heading>
              <Text fontSize="lg" fontWeight="semibold">
                Active Clients
              </Text>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor} shadow="lg">
            <CardBody textAlign="center" py={8}>
              <Heading size="2xl" color="green.500" mb={2}>
                500+
              </Heading>
              <Text fontSize="lg" fontWeight="semibold">
                Projects Completed
              </Text>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor} shadow="lg">
            <CardBody textAlign="center" py={8}>
              <HStack justify="center" mb={2}>
                <Heading size="2xl" color="yellow.500">
                  4.9
                </Heading>
                <Icon as={StarIcon} w={8} h={8} color="yellow.500" />
              </HStack>
              <Text fontSize="lg" fontWeight="semibold">
                Average Rating
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Core Values Section */}
        <VStack spacing={12} mb={20}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="blue.600">
              Our Core Values
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="3xl">
              Built on the foundation of trust, excellence, and efficiency - these values guide 
              every interaction and project we undertake.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            <Card bg={cardBg} borderColor={borderColor} shadow="lg">
              <CardBody p={8}>
                <VStack spacing={4} align="start">
                  <Icon as={CheckIcon} w={10} h={10} color="blue.500" />
                  <Heading size="md" color="blue.600">
                    Integrity
                  </Heading>
                  <Text color="gray.600">
                    We believe in honest communication, transparent pricing, and ethical business 
                    practices. Your trust is our foundation.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor} shadow="lg">
              <CardBody p={8}>
                <VStack spacing={4} align="start">
                  <Icon as={CheckIcon} w={10} h={10} color="green.500" />
                  <Heading size="md" color="green.600">
                    Quality
                  </Heading>
                  <Text color="gray.600">
                    Every project meets the highest standards. Our experts are vetted professionals 
                    committed to excellence.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor} shadow="lg">
              <CardBody p={8}>
                <VStack spacing={4} align="start">
                  <Icon as={CheckIcon} w={10} h={10} color="purple.500" />
                  <Heading size="md" color="purple.600">
                    Prompt
                  </Heading>
                  <Text color="gray.600">
                    Time is valuable. We deliver on schedule with efficient communication and 
                    streamlined processes.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>

        {/* Services Section */}
        <VStack spacing={12} mb={20}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="blue.600">
              Services We Offer
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="3xl">
              From web development to AI solutions, connect with vetted professionals who deliver 
              exceptional results across all major industries.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {/* Web Development */}
            <Card bg={cardBg} borderColor={borderColor} shadow="lg">
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md" color="blue.600">
                    Web Development
                  </Heading>
                  <Text color="gray.600">
                    Full-stack web applications, APIs, and custom software solutions:
                  </Text>
                  <Stack spacing={1} pl={4}>
                    <Text>• React & Node.js</Text>
                    <Text>• Python & Django</Text>
                    <Text>• Custom APIs</Text>
                    <Text>• Database Design</Text>
                  </Stack>
                </VStack>
              </CardBody>
            </Card>

            {/* Design & Creative */}
            <Card bg={cardBg} borderColor={borderColor} shadow="lg">
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md" color="green.600">
                    Design & Creative
                  </Heading>
                  <Text color="gray.600">
                    UI/UX design, branding, and creative solutions:
                  </Text>
                  <Stack spacing={1} pl={4}>
                    <Text>• UI/UX Design</Text>
                    <Text>• Branding & Identity</Text>
                    <Text>• Frontend Technologies</Text>
                    <Text>• Creative Consulting</Text>
                  </Stack>
                </VStack>
              </CardBody>
            </Card>

            {/* AI & Machine Learning */}
            <Card bg={cardBg} borderColor={borderColor} shadow="lg">
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md" color="purple.600">
                    AI & Machine Learning
                  </Heading>
                  <Text color="gray.600">
                    AI agents, chatbots, automation, and intelligent systems:
                  </Text>
                  <Stack spacing={1} pl={4}>
                    <Text>• AI Agents</Text>
                    <Text>• Chatbots</Text>
                    <Text>• Automation</Text>
                    <Text>• NLP & Workflows</Text>
                  </Stack>
                </VStack>
              </CardBody>
            </Card>

            {/* Cybersecurity */}
            <Card bg={cardBg} borderColor={borderColor} shadow="lg">
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md" color="red.600">
                    Cybersecurity
                  </Heading>
                  <Text color="gray.600">
                    Comprehensive security services and consulting:
                  </Text>
                  <Stack spacing={1} pl={4}>
                    <Text>• Security Analysts</Text>
                    <Text>• Penetration Testing</Text>
                    <Text>• Incident Response</Text>
                    <Text>• Ethical Hacking</Text>
                  </Stack>
                </VStack>
              </CardBody>
            </Card>

            {/* Technical Writing */}
            <Card bg={cardBg} borderColor={borderColor} shadow="lg">
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md" color="orange.600">
                    Technical Writing
                  </Heading>
                  <Text color="gray.600">
                    Professional writing and documentation services:
                  </Text>
                  <Stack spacing={1} pl={4}>
                    <Text>• Academic Writing</Text>
                    <Text>• Technical Documentation</Text>
                    <Text>• Articles & Essays</Text>
                    <Text>• Research Papers</Text>
                  </Stack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>

        {/* Leadership Section */}
        <VStack spacing={8} mb={20}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="blue.600">
              Leadership
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Meet the visionary behind Mai-Guru
            </Text>
          </VStack>
          <CEOSection />
        </VStack>

        {/* Final Call-to-Action */}
        <Card bgGradient="linear(to-r, blue.600, purple.600)" color="white" shadow="2xl">
          <CardBody p={12} textAlign="center">
            <VStack spacing={6}>
              <Heading size="xl">
                Ready to Launch Your Next Project?
              </Heading>
              <Text fontSize="lg" color="whiteAlpha.900">
                Get started in minutes and work with top experts. Join thousands of satisfied clients.
              </Text>
              <HStack spacing={4}>
                <Button
                  as={Link}
                  to="/auth"
                  colorScheme="whiteAlpha"
                  variant="solid"
                  size="lg"
                  px={8}
                  py={6}
                  fontSize="lg"
                >
                  Work with Us
                </Button>
                <Button
                  as={Link}
                  to="/auth"
                  variant="outline"
                  color="white"
                  borderColor="whiteAlpha.700"
                  size="lg"
                  px={8}
                  py={6}
                  fontSize="lg"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Get Started
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
}