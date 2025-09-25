import {
  Box,
  Heading,
  VStack,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Text,
  List,
  ListItem,
  Button,
} from '@chakra-ui/react';
import SubmissionForm from '../../components/expert/SubmissionForm';
import Chat from '../../components/expert/Chat';

// Placeholder data for assigned projects
const assignedProjects = [
  { id: 1, title: 'Develop a REST API', status: 'In Progress', deadline: '2024-07-20' },
  { id: 2, title: 'Design UI/UX for Mobile App', status: 'Pending', deadline: '2024-08-05' },
];

export default function ExpertDashboard() {
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Expert Dashboard</Heading>
      <VStack spacing={8} align="stretch">
        <Card>
          <CardHeader>
            <Heading size="md">Assigned Projects</Heading>
          </CardHeader>
          <CardBody>
            {assignedProjects.length > 0 ? (
              <List spacing={3}>
                {assignedProjects.map((project) => (
                  <ListItem key={project.id}>
                    <Text fontWeight="bold">{project.title}</Text>
                    <Text>Status: {project.status}</Text>
                    <Text>Deadline: {project.deadline}</Text>
                    <Button size="sm" colorScheme="blue">View Details</Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text>No projects assigned yet.</Text>
            )}
          </CardBody>
        </Card>

        <Divider />

        <Card>
          <CardHeader>
            <Heading size="md">Submission Form</Heading>
          </CardHeader>
          <CardBody>
            <SubmissionForm />
          </CardBody>
        </Card>

        <Divider />

        <Card>
          <CardHeader>
            <Heading size="md">Chat with Client</Heading>
          </CardHeader>
          <CardBody>
            <Chat />
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
