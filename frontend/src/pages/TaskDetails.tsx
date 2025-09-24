import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text } from '@chakra-ui/react';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Box p={8}>
      <Heading size="lg" mb={4}>Task Details</Heading>
      <Text>Viewing details for task ID: {id}</Text>
    </Box>
  );
};

export default TaskDetails;
