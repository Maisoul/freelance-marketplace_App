import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  HStack,
  useToast,
  FormErrorMessage,
  Card,
  CardBody,
  Divider,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/useAuth';
import { createClientTask } from '../../services/clientApi';

interface TaskFormData {
  title: string;
  description: string;
  category: string;
  complexity: string;
  budget_range: string;
  deadline: string;
  user_type: string;
  company_name: string;
  company_email: string;
  contact_person: string;
  additional_comments: string;
  client_requirements: string;
}

const CATEGORIES = [
  { value: 'web_development', label: 'Web Development' },
  { value: 'ai_ml', label: 'AI & Machine Learning' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'technical_writing', label: 'Technical Writing' },
  { value: 'design', label: 'Design & Creative' },
];

const COMPLEXITY_LEVELS = [
  { value: 'simple', label: 'Simple' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'complex', label: 'Complex' },
];

const BUDGET_RANGES = [
  { value: 'less_100', label: 'Less than $100' },
  { value: '100_500', label: '$100 - $500' },
  { value: '501_1000', label: '$501 - $1000' },
  { value: '1001_2000', label: '$1001 - $2000' },
  { value: 'above_2000', label: 'Above $2000' },
];

const USER_TYPES = [
  { value: 'student', label: 'Student' },
  { value: 'organization', label: 'Organization' },
];

export default function TaskForm() {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: '',
    complexity: '',
    budget_range: '',
    deadline: '',
    user_type: 'student',
    company_name: '',
    company_email: '',
    contact_person: '',
    additional_comments: '',
    client_requirements: '',
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/vnd.apple.pages': ['.pages'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.complexity) newErrors.complexity = 'Complexity is required';
    if (!formData.budget_range) newErrors.budget_range = 'Budget range is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';

    // Organization-specific validations
    if (formData.user_type === 'organization') {
      if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
      if (!formData.company_email.trim()) newErrors.company_email = 'Company email is required';
      if (!formData.contact_person.trim()) newErrors.contact_person = 'Contact person is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Add files
      files.forEach((file, index) => {
        formDataToSend.append(`file_${index}`, file);
      });

      await createClientTask(formDataToSend);
      
      toast({
        title: 'Task Submitted Successfully',
        description: 'Your task has been submitted and will be reviewed by our team',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        complexity: '',
        budget_range: '',
        deadline: '',
        user_type: 'student',
        company_name: '',
        company_email: '',
        contact_person: '',
        additional_comments: '',
        client_requirements: '',
      });
      setFiles([]);
      onClose();

    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your task. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>Submit New Task</Heading>
              <Text color="gray.600">
                Fill out the form below to submit your project requirements. Our AI will analyze 
                your request and provide competitive pricing suggestions.
              </Text>
            </Box>

            <Button onClick={onOpen} colorScheme="blue" size="lg">
              Create New Task
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>Submit New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                {/* Basic Information */}
                <Box>
                  <Heading size="md" mb={4}>Basic Information</Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!errors.title}>
                      <FormLabel>Task Title *</FormLabel>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Brief description of your project"
                      />
                      <FormErrorMessage>{errors.title}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.description}>
                      <FormLabel>Task Description *</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Detailed description of what you need"
                        rows={4}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>

                    <HStack spacing={4}>
                      <FormControl isInvalid={!!errors.category}>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          placeholder="Select category"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{errors.category}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.complexity}>
                        <FormLabel>Complexity *</FormLabel>
                        <Select
                          name="complexity"
                          value={formData.complexity}
                          onChange={handleInputChange}
                          placeholder="Select complexity"
                        >
                          {COMPLEXITY_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{errors.complexity}</FormErrorMessage>
                      </FormControl>
                    </HStack>

                    <HStack spacing={4}>
                      <FormControl isInvalid={!!errors.budget_range}>
                        <FormLabel>Budget Range *</FormLabel>
                        <Select
                          name="budget_range"
                          value={formData.budget_range}
                          onChange={handleInputChange}
                          placeholder="Select budget range"
                        >
                          {BUDGET_RANGES.map(range => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{errors.budget_range}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.deadline}>
                        <FormLabel>Deadline *</FormLabel>
                        <Input
                          name="deadline"
                          type="datetime-local"
                          value={formData.deadline}
                          onChange={handleInputChange}
                        />
                        <FormErrorMessage>{errors.deadline}</FormErrorMessage>
                      </FormControl>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                {/* User Type */}
                <Box>
                  <Heading size="md" mb={4}>User Information</Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>User Type *</FormLabel>
                      <Select
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleInputChange}
                      >
                        {USER_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {formData.user_type === 'organization' && (
                      <>
                        <HStack spacing={4}>
                          <FormControl isInvalid={!!errors.company_name}>
                            <FormLabel>Company Name *</FormLabel>
                            <Input
                              name="company_name"
                              value={formData.company_name}
                              onChange={handleInputChange}
                              placeholder="Your company name"
                            />
                            <FormErrorMessage>{errors.company_name}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errors.contact_person}>
                            <FormLabel>Contact Person *</FormLabel>
                            <Input
                              name="contact_person"
                              value={formData.contact_person}
                              onChange={handleInputChange}
                              placeholder="Your name"
                            />
                            <FormErrorMessage>{errors.contact_person}</FormErrorMessage>
                          </FormControl>
                        </HStack>

                        <FormControl isInvalid={!!errors.company_email}>
                          <FormLabel>Company Email *</FormLabel>
                          <Input
                            name="company_email"
                            type="email"
                            value={formData.company_email}
                            onChange={handleInputChange}
                            placeholder="company@example.com"
                          />
                          <FormErrorMessage>{errors.company_email}</FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                  </VStack>
                </Box>

                <Divider />

                {/* Additional Information */}
                <Box>
                  <Heading size="md" mb={4}>Additional Information</Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Additional Comments</FormLabel>
                      <Textarea
                        name="additional_comments"
                        value={formData.additional_comments}
                        onChange={handleInputChange}
                        placeholder="Any additional information or special requirements"
                        rows={3}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Client Requirements</FormLabel>
                      <Textarea
                        name="client_requirements"
                        value={formData.client_requirements}
                        onChange={handleInputChange}
                        placeholder="Specific requirements, preferences, or constraints"
                        rows={3}
                      />
                    </FormControl>
                  </VStack>
                </Box>

                <Divider />

                {/* File Upload */}
                <Box>
                  <Heading size="md" mb={4}>File Upload</Heading>
                  <VStack spacing={4} align="stretch">
                    <Box
                      {...getRootProps()}
                      p={6}
                      border="2px dashed"
                      borderColor={isDragActive ? 'blue.500' : 'gray.300'}
                      borderRadius="md"
                      textAlign="center"
                      cursor="pointer"
                      _hover={{ borderColor: 'blue.400' }}
                    >
                      <input {...getInputProps()} />
                      <Text>
                        {isDragActive
                          ? 'Drop the files here...'
                          : 'Drag & drop files here, or click to select files'}
                      </Text>
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        Supported formats: PDF, DOC, DOCX, TXT, MD, PAGES (Max 10MB each)
                      </Text>
                    </Box>

                    {files.length > 0 && (
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Selected Files:</Text>
                        <VStack align="stretch" spacing={2}>
                          {files.map((file, index) => (
                            <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                              <Text fontSize="sm">{file.name}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </Box>

                {/* Submit Button */}
                <HStack justify="end" spacing={4}>
                  <Button onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText="Submitting..."
                  >
                    Submit Task
                  </Button>
                </HStack>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}