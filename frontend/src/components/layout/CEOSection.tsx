import React from 'react';
import { Box, Image, Text, Button, VStack, HStack, Icon } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function CEOSection() {
  return (
    <Box textAlign="center" maxW="md" mx="auto">
      <VStack spacing={6}>
        {/* CEO Image */}
        <Box
          borderRadius="full"
          overflow="hidden"
          boxSize="200px"
          mx="auto"
          border="4px solid"
          borderColor="blue.200"
          shadow="xl"
        >
          <Image
            src="/ceo.JPG"
            alt="CEO - Mai-Guru Founder"
            boxSize="200px"
            objectFit="cover"
          />
        </Box>
        
        {/* CEO Info */}
        <VStack spacing={3}>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            CEO & Founder
          </Text>
          <Text fontSize="lg" color="gray.600" maxW="sm">
            Visionary leader driving innovation in the freelance marketplace with 
            AI-powered solutions and exceptional service delivery.
          </Text>
        </VStack>
        
        {/* Action Buttons */}
        <HStack spacing={4}>
          <Button
            as="a"
            href="https://maiso-cyber-hub.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="blue"
            variant="solid"
            size="md"
            rightIcon={<ExternalLinkIcon />}
          >
            View Profile
          </Button>
          <Button
            as="a"
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="blue"
            variant="outline"
            size="md"
            rightIcon={<ExternalLinkIcon />}
          >
            LinkedIn
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}