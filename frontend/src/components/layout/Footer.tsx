import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Text,
  Link as ChakraLink,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
// Add these imports for social media icons
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

export default function Footer() {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box as="footer" bg={bg} borderTop="1px" borderColor={borderColor} py={12}>
      <Container maxW="7xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          {/* Company Info */}
          <VStack align="start" spacing={4}>
            <Heading size="md" color="blue.600">
              Mai-Guru
            </Heading>
            <Text color={textColor} fontSize="sm">
              Your AI-powered freelance platform connecting students and organizations 
              with elite tech experts. Integrity, Quality & Prompt service.
            </Text>
            <Text color={textColor} fontSize="sm" fontStyle="italic">
              Tell a Friend to Tell a Friend 🙂
            </Text>
          </VStack>

          {/* Services */}
          <VStack align="start" spacing={3}>
            <Heading size="sm" color="gray.800">
              Services
            </Heading>
            <VStack align="start" spacing={2}>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Web Development
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                AI & Machine Learning
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Cybersecurity
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Technical Writing
              </ChakraLink>
            </VStack>
          </VStack>

          {/* Company */}
          <VStack align="start" spacing={3}>
            <Heading size="sm" color="gray.800">
              Company
            </Heading>
            <VStack align="start" spacing={2}>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                About Us
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Contact
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Careers
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Blog
              </ChakraLink>
            </VStack>
          </VStack>

          {/* Legal & Support */}
          <VStack align="start" spacing={3}>
            <Heading size="sm" color="gray.800">
              Legal & Support
            </Heading>
            <VStack align="start" spacing={2}>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Privacy Policy
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Terms of Service
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Support
              </ChakraLink>
              <ChakraLink as={Link} to="#" color={textColor} fontSize="sm">
                Help Center
              </ChakraLink>
            </VStack>
          </VStack>
        </SimpleGrid>

        {/* Bottom Section */}
        <Box mt={8} pt={8} borderTop="1px" borderColor={borderColor}>
          <HStack justify="space-between" align="center">
            <Text color={textColor} fontSize="sm">
              © {new Date().getFullYear()} Mai-Guru. All rights reserved.
            </Text>
            <HStack spacing={4}>
              <ChakraLink
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                color={textColor}
                _hover={{ color: 'blue.500' }}
              >
                <Icon as={FaLinkedin} w={5} h={5} />
              </ChakraLink>
              <ChakraLink
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                color={textColor}
                _hover={{ color: 'blue.500' }}
              >
                <Icon as={FaTwitter} w={5} h={5} />
              </ChakraLink>
              <ChakraLink
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                color={textColor}
                _hover={{ color: 'blue.500' }}
              >
                <Icon as={FaGithub} w={5} h={5} />
              </ChakraLink>
            </HStack>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
}