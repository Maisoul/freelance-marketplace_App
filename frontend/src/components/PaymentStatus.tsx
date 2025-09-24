import { Box, Text, Badge } from '@chakra-ui/react';

interface PaymentStatusProps {
  status: string;
}

export default function PaymentStatus({ status }: PaymentStatusProps) {
  const colorScheme = status === 'Completed' ? 'green' : 'orange';
  return (
    <Box mt={4}>
      <Text fontWeight="bold" display="inline">Payment Status: </Text>
      <Badge colorScheme={colorScheme} ml={2}>{status}</Badge>
    </Box>
  );
}
