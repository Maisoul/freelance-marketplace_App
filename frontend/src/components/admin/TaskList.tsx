
import { Box, Heading, List, ListItem, Text, Spinner, Alert, AlertIcon, Button, HStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { fetchAllTasks, markTaskCompleted } from '../../services/adminApi';
import type { AdminTask } from '../../services/adminApi';

export default function TaskList() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllTasks()
      .then(setTasks)
      .catch(() => setError('Failed to load tasks.'))
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async (taskId: number) => {
    try {
      const updated = await markTaskCompleted(taskId);
      setTasks((prev) => prev.map(t => t.id === taskId ? updated : t));
    } catch {
      setError('Failed to mark task as completed.');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading size="md" mb={2}>All Tasks</Heading>
      <List spacing={2}>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold">
                  {(task.client ? `${task.client.first_name || ''} ${task.client.last_name || ''}`.trim() : 'N/A')} - {task.title}
                </Text>
                <Text>
                  Status: {task.status}
                  {task.time_to_deadline ? ` | Deadline: ${task.time_to_deadline}` : ''}
                  {` | Created: ${new Date(task.created_at).toLocaleDateString()}`}
                </Text>
              </Box>
              <Button size="sm" colorScheme="green" onClick={() => handleComplete(task.id)} isDisabled={task.status === 'completed'}>
                {task.status === 'completed' ? 'Completed' : 'Mark Completed'}
              </Button>
            </HStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
