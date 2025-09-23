import { Box, Text, Center } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" py={4} bg="gray.100" mt={8}>
      <Center>
        <Text fontSize="sm" color="gray.600">
          &copy; {new Date().getFullYear()} Freelance Marketplace. All rights reserved.
        </Text>
      </Center>
    </Box>
  );
}
