
import { Box, Heading, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { inviteExpert } from '../../services/adminApi';

export default function InviteExpert() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await inviteExpert(email);
      if (res.success) {
        toast({ title: 'Expert invited!', status: 'success', duration: 3000 });
        setEmail('');
      } else {
        toast({ title: res.message || 'Invite failed.', status: 'error', duration: 3000 });
      }
    } catch {
      toast({ title: 'Invite failed.', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
      <Heading size="md" mb={2}>Invite Expert</Heading>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={loading} mt={2}>Send Invite</Button>
    </Box>
  );
}
