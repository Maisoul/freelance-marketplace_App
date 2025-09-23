
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { createClientTask } from '../../services/clientApi';

export default function TaskForm() {
  const [form, setForm] = useState({
    fullName: '',
    country: '',
    category: '',
    deadline: '',
    userType: '',
    email: '',
    contact: '',
    companyName: '',
    description: '',
    complexity: '',
    comments: '',
    budget: '',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      // Prepare form data for file upload
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'file' && value) {
          formData.append('file', value as File);
        } else if (value) {
          formData.append(key, value as string);
        }
      });
      await createClientTask(formData);
      toast({ title: 'Task submitted!', status: 'success', duration: 3000 });
      setForm({
        fullName: '', country: '', category: '', deadline: '', userType: '', email: '', contact: '', companyName: '', description: '', complexity: '', comments: '', budget: '', file: null
      });
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
          <FormLabel>Full Name</FormLabel>
          <Input name="fullName" value={form.fullName} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Country</FormLabel>
          <Input name="country" value={form.country} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Category</FormLabel>
          <Select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            <option value="AI">AI</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            {/* Add more categories as needed */}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Deadline</FormLabel>
          <Input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>User Type</FormLabel>
          <Select name="userType" value={form.userType} onChange={handleChange}>
            <option value="">Select type</option>
            <option value="Student">Student</option>
            <option value="Organization">Organization</option>
          </Select>
        </FormControl>
        {form.userType === 'Organization' && (
          <FormControl>
            <FormLabel>Company Name</FormLabel>
            <Input name="companyName" value={form.companyName} onChange={handleChange} />
          </FormControl>
        )}
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input name="email" type="email" value={form.email} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Contact</FormLabel>
          <Input name="contact" value={form.contact} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Task Description</FormLabel>
          <Textarea name="description" value={form.description} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Complexity</FormLabel>
          <Select name="complexity" value={form.complexity} onChange={handleChange}>
            <option value="">Select complexity</option>
            <option value="Simple">Simple</option>
            <option value="Moderate">Moderate</option>
            <option value="Complex">Complex</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Additional Comments</FormLabel>
          <Textarea name="comments" value={form.comments} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>File Upload</FormLabel>
          <Input name="file" type="file" accept=".pdf,.doc,.md,.txt,.pages" onChange={handleFileChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Budget Range</FormLabel>
          <Select name="budget" value={form.budget} onChange={handleChange}>
            <option value="">Select budget</option>
            <option value="$100-$500">$100-$500</option>
            <option value="$500-$1000">$500-$1000</option>
            <option value="$1000+">$1000+</option>
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={loading}>Submit Task</Button>
      </VStack>
    </Box>
  );
}
