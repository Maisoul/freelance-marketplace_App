import {
  Box,
  Heading,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import TaskList from '../../components/admin/TaskList';
import ProjectManager from '../../components/admin/ProjectManager';
import InviteExpert from '../../components/admin/InviteExpert';
import Chatbot from '../../components/admin/Chatbot';

export default function AdminDashboard() {
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Admin Dashboard</Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Card>
            <CardHeader>
              <Heading size="md">Task List</Heading>
            </CardHeader>
            <CardBody>
              <TaskList />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Card>
            <CardHeader>
              <Heading size="md">Project Manager</Heading>
            </CardHeader>
            <CardBody>
              <ProjectManager />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Card>
            <CardHeader>
              <Heading size="md">Invite Expert</Heading>
            </CardHeader>
            <CardBody>
              <InviteExpert />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Card>
            <CardHeader>
              <Heading size="md">Chatbot</Heading>
            </CardHeader>
            <CardBody>
              <Chatbot />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}
