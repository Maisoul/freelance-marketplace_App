
import { Box, Heading, List, ListItem, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { fetchExpertProjects } from '../../services/expertApi';
import type { Project } from '../../services/expertApi';


export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpertProjects()
      .then(setProjects)
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading size="md" mb={2}>Your Projects</Heading>
      <List spacing={2}>
        {projects.map((proj) => (
          <ListItem key={proj.id}>
            <Text fontWeight="bold">{proj.title}</Text>
            <Text>Status: {proj.status} | Deadline: {proj.deadline}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
