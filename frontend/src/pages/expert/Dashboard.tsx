import { Box, Heading, VStack, Divider } from '@chakra-ui/react';
import ProjectList from '../../components/expert/ProjectList';
import SubmissionForm from '../../components/expert/SubmissionForm';
import Chat from '../../components/expert/Chat';

export default function ExpertDashboard() {
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Expert Dashboard</Heading>
      <VStack spacing={8} align="stretch">
        <ProjectList />
        <Divider />
        <SubmissionForm />
        <Divider />
        <Chat />
      </VStack>
    </Box>
  );
}
