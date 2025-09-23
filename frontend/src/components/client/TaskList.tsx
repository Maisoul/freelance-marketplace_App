
import { Box, Heading, List, ListItem, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { fetchClientTasks } from '../../services/clientApi';
import type { ClientTask } from '../../services/clientApi';

export default function TaskList() {
  const [tasks, setTasks] = useState<ClientTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientTasks()
      .then(setTasks)
      .catch(() => setError('Failed to load tasks.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading size="md" mb={2}>Your Tasks</Heading>
      <List spacing={2}>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <Text fontWeight="bold">{task.title}</Text>
            <Text>Status: {task.status} | Created: {new Date(task.created_at).toLocaleDateString()}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
