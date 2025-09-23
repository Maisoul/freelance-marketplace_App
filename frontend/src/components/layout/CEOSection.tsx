import { Box, Image, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function CEOSection() {
  return (
    <Box textAlign="center" mt={8}>
      <Image src="/ceo.jpg" alt="CEO" borderRadius="full" boxSize="120px" mx="auto" />
      <Text fontWeight="bold" mt={2}>CEO: Jane Doe</Text>
      <Button as={Link} to="https://linkedin.com/in/janedoe" target="_blank" variant="link" colorScheme="blue">
        View Profile
      </Button>
    </Box>
  );
}
