import { Box, Heading, VStack, Divider } from '@chakra-ui/react';
import TaskList from '../../components/client/TaskList';
import TaskForm from '../../components/client/TaskForm';
import InvoiceList from '../../components/client/InvoiceList';
import Chat from '../../components/client/Chat';
import ReviewSection from '../../components/client/ReviewSection';

export default function ClientDashboard() {
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Client Dashboard</Heading>
      <VStack spacing={8} align="stretch">
        <TaskForm />
        <Divider />
        <TaskList />
        <Divider />
        <InvoiceList />
        <Divider />
        <Chat />
        <Divider />
        <ReviewSection />
      </VStack>
    </Box>
  );
}
