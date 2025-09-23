import { Box, Heading, Text, Button, VStack, HStack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'Tell a Friend to Tell a Friend 🙂 | Integrity, Quality & Prompt';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Freelance marketplace for AI, security, development, and design. Integrity, Quality & Prompt.');
    } else {
      const tag = document.createElement('meta');
      tag.name = 'description';
      tag.content = 'Freelance marketplace for AI, security, development, and design. Integrity, Quality & Prompt.';
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <Box minH="100vh" bg="gray.50" py={16} px={4}>
      <VStack spacing={8} align="center">
        <Heading size="2xl">Tell a Friend to Tell a Friend 🙂</Heading>
        <Text fontSize="xl" color="gray.600">Integrity, Quality & Prompt</Text>
        <HStack spacing={6}>
          <Button as={Link} to="/client/register" colorScheme="blue">I'm a Client</Button>
          <Button as={Link} to="/expert/register" colorScheme="green">I'm an Expert</Button>
          <Button as={Link} to="/admin/login" colorScheme="purple">Admin Login</Button>
        </HStack>
        <Box textAlign="center">
          <Image src="/ceo.jpg" alt="CEO" borderRadius="full" boxSize="120px" mx="auto" />
          <Text fontWeight="bold" mt={2}>CEO: Jane Doe</Text>
          <Button as={Link} to="https://linkedin.com/in/janedoe" target="_blank" variant="link" colorScheme="blue">
            View Profile
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
