// Import FormControl and FormLabel from Chakra UI
import { Box, Heading, List, ListItem, Text, Button, Spinner, Alert, AlertIcon, Select, VStack, HStack, useToast } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { fetchAllProjects, assignExpertToProject, markTaskCompleted } from '../../services/adminApi';
import type { AdminTask } from '../../services/adminApi';


export default function ProjectManager() {
  const [projects, setProjects] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<number | null>(null);
  const [completing, setCompleting] = useState<number | null>(null);
  const toast = useToast();
  // TODO: Replace with real expert list from API when available
  const experts = useMemo(() => ([
    { id: 1, name: 'Expert A' },
    { id: 2, name: 'Expert B' },
  ]), []);
  const [selectedExpert, setSelectedExpert] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetchAllProjects()
      .then(setProjects)
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (projectId: number) => {
    const expertId = selectedExpert[projectId];
    if (!expertId) return;
    setAssigning(projectId);
    try {
      const updated = await assignExpertToProject(projectId, expertId);
      setProjects((prev) => prev.map(p => p.id === projectId ? updated : p));
      toast({ title: 'Expert assigned', status: 'success', duration: 2500 });
    } catch (e) {
      setError('Failed to assign expert.');
    } finally {
      setAssigning(null);
    }
  };

  const handleComplete = async (projectId: number) => {
    setCompleting(projectId);
    try {
      const updated = await markTaskCompleted(projectId);
      setProjects((prev) => prev.map(p => p.id === projectId ? updated : p));
      toast({ title: 'Task marked as completed', status: 'success', duration: 2500 });
    } catch (e) {
      setError('Failed to mark task as completed.');
    } finally {
      setCompleting(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading size="md" mb={2}>Project Management</Heading>
      <List spacing={2}>
        {projects.map((proj) => (
          <ListItem key={proj.id}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">{proj.title}</Text>
              <Text>Status: {proj.status}</Text>
              {proj.time_to_deadline && (
                <Text>Deadline: {proj.time_to_deadline}</Text>
              )}
              <Text>Assigned Expert: {proj.assigned_expert ? String(proj.assigned_expert) : 'None'}</Text>
              <HStack>
                <Select
                  placeholder="Assign Expert"
                  value={selectedExpert[proj.id] || ''}
                  onChange={e => setSelectedExpert(s => ({ ...s, [proj.id]: Number(e.target.value) }))}
                  size="sm"
                  width="200px"
                >
                  {experts.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </Select>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleAssign(proj.id)}
                  isLoading={assigning === proj.id}
                  isDisabled={!selectedExpert[proj.id]}
                >
                  Assign
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  onClick={() => handleComplete(proj.id)}
                  isLoading={completing === proj.id}
                  isDisabled={proj.status === 'completed'}
                >
                  Mark Completed
                </Button>
              </HStack>
            </VStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
