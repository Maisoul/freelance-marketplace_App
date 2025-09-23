import { Box, Heading, VStack, Divider } from '@chakra-ui/react';
import TaskList from '../../components/admin/TaskList';
import ProjectManager from '../../components/admin/ProjectManager';
import InviteExpert from '../../components/admin/InviteExpert';
import Chatbot from '../../components/admin/Chatbot';

export default function AdminDashboard() {
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Admin Dashboard</Heading>
      <VStack spacing={8} align="stretch">
        <TaskList />
        <Divider />
        <ProjectManager />
        <Divider />
        <InviteExpert />
        <Divider />
        <Chatbot />
      </VStack>
    </Box>
  );
}
