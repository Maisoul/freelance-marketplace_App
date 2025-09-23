
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { submitExpertWork } from '../../services/expertApi';

export default function SubmissionForm() {
  const [form, setForm] = useState({
    projectId: '',
    notes: '',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, file: e.target.files ? e.target.files[0] : null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitExpertWork(form);
      if (res.success) {
        toast({ title: 'Submission sent!', status: 'success', duration: 3000 });
        setForm({ projectId: '', notes: '', file: null });
      } else {
        toast({ title: res.message || 'Submission failed.', status: 'error', duration: 3000 });
      }
    } catch {
      toast({ title: 'Submission failed.', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Project ID</FormLabel>
          <Input name="projectId" value={form.projectId} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea name="notes" value={form.notes} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>File Upload</FormLabel>
          <Input name="file" type="file" accept=".pdf,.doc,.md,.txt,.pages" onChange={handleFileChange} />
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={loading}>Submit</Button>
      </VStack>
    </Box>
  );
}
