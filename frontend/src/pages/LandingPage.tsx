import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Image,
  Stack,
  Badge,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCode, FaRobot, FaShieldAlt, FaPenAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CheckIcon, StarIcon } from '@chakra-ui/icons';
import CEOSection from '../components/layout/CEOSection';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const bgGradient = useColorModeValue(
    'linear-gradient( 120deg, #bdc3c7 0%, #BBD2C5 50%, #cc2b5e 100%)',
    'linear-gradient(120deg, #16222a 0%, #3a6073 50%, #16222a 100%)'
  ); 
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('silver.100', 'gray.600');
  const secondaryTextColor = useColorModeValue('silver.600', 'gray.300');

  return (
    <Box minH="100vh" bgGradient={bgGradient} color={textColor}>
      <Navbar />
      <Container maxW="7xl" py={{ base: 8, md: 16 }}>
        {/* Hero Section */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} alignItems="center" mb={20}>
          <VStack align="start" spacing={6}>
            <Badge 
              colorScheme="purple" 
              px={4} 
              py={2} 
              borderRadius="full" 
              fontSize="sm"
              bg="purple.100"
              color="purple.700"
            >
              Integrity, Quality & Prompt
            </Badge>
            <Heading as="h1" size="2xl" lineHeight="1.2" color="blue.700" fontWeight="bold">
              Tell a Friend to Tell a Friend 🙂
            </Heading>
            <Text fontSize="xl" color={secondaryTextColor} maxW="2xl" fontWeight="medium">
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
                bg="blue.600"
                _hover={{ bg: 'blue.700' }}
                color="white"
                fontWeight="bold"
              >
                WORK with US
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
                borderWidth="2px"
                fontWeight="semibold"
                _hover={{ bg: 'blue.50' }}
              >
                Get Started
              </Button>
            </HStack>
          </VStack>
          <Box position="relative">
            <Image
              src="https://cdn-server-blog.hiddenbrains.com/blog/wp-content/uploads/2023/05/cropped-top-view-unrecognizable-hacker-performing-cyberattack-night-1.jpg"
              alt="Mai-Guru Platform"
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "1rem",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 100, 0.3)",
                objectFit: "cover"
                }}
            />
          </Box>
        </SimpleGrid>

        {/* KPI Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={20}>
          <Card bg={cardBg} borderColor={borderColor} shadow="xl" borderRadius="2xl">
            <CardBody textAlign="center" py={10}>
              <Heading size="2xl" color="blue.500" mb={2} fontWeight="bold">
                1000+
              </Heading>
              <Text fontSize="lg" fontWeight="semibold" color={secondaryTextColor}>
                Active Clients
              </Text>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor} shadow="xl" borderRadius="2xl">
            <CardBody textAlign="center" py={10}>
              <Heading size="2xl" color="green.500" mb={2} fontWeight="bold">
                500+
              </Heading>
              <Text fontSize="lg" fontWeight="semibold" color={secondaryTextColor}>
                Projects Completed
              </Text>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor} shadow="xl" borderRadius="2xl">
            <CardBody textAlign="center" py={10}>
              <HStack justify="center" mb={2}>
                <Heading size="2xl" color="yellow.500" fontWeight="bold">
                  4.9
                </Heading>
                <Icon as={StarIcon} w={8} h={8} color="yellow.500" />
              </HStack>
              <Text fontSize="lg" fontWeight="semibold" color={secondaryTextColor}>
                Average Rating
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Core Values Section */}
        <VStack spacing={12} mb={20}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="blue.700" fontWeight="bold">
              Our Core Values
            </Heading>
            <Text fontSize="lg" color={secondaryTextColor} maxW="3xl" fontWeight="medium">
              Built on the foundation of trust, excellence, and efficiency - these values guide 
              every interaction and project we undertake.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            <Card bg={cardBg} borderColor={borderColor} shadow="xl" borderRadius="2xl" _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s' }}>
              <CardBody p={8}>
                <VStack spacing={4} align="start">
                  <Icon as={CheckIcon} w={10} h={10} color="blue.500" bg="blue.100" p={2} borderRadius="lg" />
                  <Heading size="md" color="blue.700" fontWeight="semibold">
                    Integrity
                  </Heading>
                  <Text color={secondaryTextColor} lineHeight="1.6">
                    We believe in honest communication, transparent pricing, and ethical business 
                    practices. Your trust is our foundation.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor} shadow="xl" borderRadius="2xl" _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s' }}>
              <CardBody p={8}>
                <VStack spacing={4} align="start">
                  <Icon as={CheckIcon} w={10} h={10} color="green.500" bg="green.100" p={2} borderRadius="lg" />
                  <Heading size="md" color="green.700" fontWeight="semibold">
                    Quality
                  </Heading>
                  <Text color={secondaryTextColor} lineHeight="1.6">
                    Every project meets the highest standards. Our experts are vetted professionals 
                    committed to excellence.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor} shadow="xl" borderRadius="2xl" _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s' }}>
              <CardBody p={8}>
                <VStack spacing={4} align="start">
                  <Icon as={CheckIcon} w={10} h={10} color="purple.500" bg="purple.100" p={2} borderRadius="lg" />
                  <Heading size="md" color="purple.700" fontWeight="semibold">
                    Prompt
                  </Heading>
                  <Text color={secondaryTextColor} lineHeight="1.6">
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
    <Heading size="xl" color="blue.700" fontWeight="bold">
      Services We Offer
    </Heading>
    <Text fontSize="lg" color={secondaryTextColor} maxW="3xl" fontWeight="medium">
      From web development to AI solutions, connect with vetted professionals who deliver 
      exceptional results across all major industries.
    </Text>
  </VStack>
  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
    {/* Web Development */}
    <Card 
      bgGradient="linear(to-br, blue.50, green.50)" 
      borderColor="blue.200" 
      shadow="2xl" 
      borderRadius="3xl"
      borderWidth="2px"
      _hover={{ 
        transform: 'translateY(-8px) scale(1.02)', 
        transition: 'all 0.3s ease-in-out',
        shadow: '2xl'
      }}
      position="relative"
      overflow="hidden"
    >
      <Box 
        position="absolute" 
        top={-2} 
        right={-2} 
        bg="blue.500" 
        color="white" 
        px={3} 
        py={1} 
        fontSize="sm" 
        fontWeight="bold"
        borderBottomLeftRadius="md"
      >
        Popular
      </Box>
      <CardBody p={8}>
        <VStack spacing={4} align="start">
          <Icon as={FaCode} w={12} h={12} color="blue.600" p={2} />
          <Heading size="md" color="blue.800" fontWeight="bold">
            Web Development
          </Heading>
          <Text color="gray.700" fontSize="sm" fontWeight="medium">
            Full stack apps, APIs, and custom software:
          </Text>
          <Stack spacing={2} pl={4}>
            <Text color="gray.600" fontSize="sm">• Programming: React, Node.js, Python Django</Text>
            <Text color="gray.600" fontSize="sm">• Front end technologies</Text>
            <Text color="gray.600" fontSize="sm">• Back end Development</Text>
          </Stack>
        </VStack>
      </CardBody>
    </Card>

    {/* AI & Machine Learning */}
    <Card 
      bgGradient="linear(to-br, purple.50, pink.50)" 
      borderColor="purple.200" 
      shadow="2xl" 
      borderRadius="3xl"
      borderWidth="2px"
      _hover={{ 
        transform: 'translateY(-8px) scale(1.02)', 
        transition: 'all 0.3s ease-in-out',
        shadow: '2xl'
      }}
    >
      <CardBody p={8}>
        <VStack spacing={4} align="start">
          <Icon as={FaRobot} w={12} h={12} color="purple.600" p={2} />
          <Heading size="md" color="purple.800" fontWeight="bold">
            AI & Machine Learning
          </Heading>
          <Text color="gray.700" fontSize="sm" fontWeight="medium">
            AI agents, chatbots, automation, and intelligent systems:
          </Text>
          <Stack spacing={2} pl={4}>
            <Text color="gray.600" fontSize="sm">• AI Agents</Text>
            <Text color="gray.600" fontSize="sm">• Chatbots</Text>
            <Text color="gray.600" fontSize="sm">• Automation</Text>
            <Text color="gray.600" fontSize="sm">• NLP</Text>
            <Text color="gray.600" fontSize="sm">• Workflows</Text>
          </Stack>
        </VStack>
      </CardBody>
    </Card>

    {/* Cybersecurity */}
    <Card 
      bgGradient="linear(to-br, red.50, orange.50)" 
      borderColor="red.200" 
      shadow="2xl" 
      borderRadius="3xl"
      borderWidth="2px"
      _hover={{ 
        transform: 'translateY(-8px) scale(1.02)', 
        transition: 'all 0.3s ease-in-out',
        shadow: '2xl'
      }}
    >
      <CardBody p={8}>
        <VStack spacing={4} align="start">
          <Icon as={FaShieldAlt} w={12} h={12} color="red.600" p={2} />
          <Heading size="md" color="red.800" fontWeight="bold">
            Cybersecurity
          </Heading>
          <Text color="gray.700" fontSize="sm" fontWeight="medium">
            Security Analysts, Auditors, and Ethical Hackers:
          </Text>
          <Stack spacing={2} pl={4}>
            <Text color="gray.600" fontSize="sm">• Security Analysts</Text>
            <Text color="gray.600" fontSize="sm">• Auditors</Text>
            <Text color="gray.600" fontSize="sm">• Vulnerability Assessors</Text>
            <Text color="gray.600" fontSize="sm">• Penetration Testers</Text>
            <Text color="gray.600" fontSize="sm">• Security Operations</Text>
            <Text color="gray.600" fontSize="sm">• Incident Responders</Text>
            <Text color="gray.600" fontSize="sm">• Forensic Investigators</Text>
            <Text color="gray.600" fontSize="sm">• Ethical Hacking</Text>
          </Stack>
        </VStack>
      </CardBody>
    </Card>

    {/* Writing */}
    <Card 
      bgGradient="linear(to-br, yellow.50, green.50)" 
      borderColor="yellow.200" 
      shadow="2xl" 
      borderRadius="3xl"
      borderWidth="2px"
      _hover={{ 
        transform: 'translateY(-8px) scale(1.02)', 
        transition: 'all 0.3s ease-in-out',
        shadow: '2xl'
      }}
    >
      <CardBody p={8}>
        <VStack spacing={4} align="start">
          <Icon as={FaPenAlt} w={12} h={12} color="green.600" p={2} />
          <Heading size="md" color="green.800" fontWeight="bold">
            Writing
          </Heading>
          <Text color="gray.700" fontSize="sm" fontWeight="medium">
            Professional writing and documentation services:
          </Text>
          <Stack spacing={2} pl={4}>
            <Text color="gray.600" fontSize="sm">• Academic Writing</Text>
            <Text color="gray.600" fontSize="sm">• Technical Writing</Text>
            <Text color="gray.600" fontSize="sm">• Articles</Text>
            <Text color="gray.600" fontSize="sm">• Essays</Text>
          </Stack>
        </VStack>
      </CardBody>
    </Card>
  </SimpleGrid>
</VStack>
        {/* Leadership Section */}
        <VStack spacing={8} mb={20}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="blue.700" fontWeight="bold">
              Leadership
            </Heading>
            <Text fontSize="lg" color={secondaryTextColor} fontWeight="medium">
              Meet the visionary behind Mai-Guru
            </Text>
          </VStack>
          <CEOSection />
        </VStack>

        {/* Final Call-to-Action */}
        <Card bgGradient="linear(to-r, blue.700, purple.700)" color="white" shadow="2xl" borderRadius="2xl">
          <CardBody p={12} textAlign="center">
            <VStack spacing={6}>
              <Heading size="xl" fontWeight="bold">
                Ready to Launch Your Next Project?
              </Heading>
              <Text fontSize="lg" color="whiteAlpha.900" fontWeight="medium">
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
                  fontWeight="bold"
                  _hover={{ bg: 'whiteAlpha.800', color: 'blue.700' }}
                >
                  WORK with US
                </Button>
                <Button
                  as={Link}
                  to="/auth"
                  variant="outline"
                  color="white"
                  borderColor="whiteAlpha.700"
                  borderWidth="2px"
                  size="lg"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="semibold"
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