import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  FormErrorMessage,
  Stack,
  Text,
  Alert,
  AlertIcon,
  CloseButton,
  useToast,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';

interface TaskSubmissionFormProps {
  onSubmit: (data: any) => void;
}

const TaskSubmissionForm: React.FC<TaskSubmissionFormProps> = ({ onSubmit }) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting, watch },
  } = useForm();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const toast = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ['application/pdf', 'application/msword', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.apple.pages'];

    const filteredFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`File type not supported: ${file.name}`);
        toast({
          title: 'Invalid File Type',
          description: `The file "${file.name}" has an unsupported type. Only PDF, DOC, MD, TXT, and PAGES files are allowed.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
      return true;
    });

    setSelectedFiles(filteredFiles);
    setUploadError(null);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };


  function validatePhoneNumber(value: string) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid international phone number.';
    }
  }

  const submitHandler = (data: any) => {
    // TODO: Handle form submission with file upload
    console.log('Form Data:', data);
    console.log('Selected Files:', selectedFiles);

    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    onSubmit(formData);
  };

  return (
    <Box
      bg="gray.50"
      p={6}
      rounded="md"
      shadow="md"
      width={{ base: '90%', md: '80%', lg: '70%' }}
      mx="auto"
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <VStack spacing={4} align="stretch">
          {/* Full Name */}
          <FormControl isRequired isInvalid={errors.fullName}>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <Input
              id="fullName"
              placeholder="Full Name"
              {...register('fullName', { required: 'Full Name is required' })}
            />
            <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
          </FormControl>

          {/* Country */}
          <FormControl isRequired isInvalid={errors.country}>
            <FormLabel htmlFor="country">Country</FormLabel>
            <Controller
              name="country"
              control={control}
              defaultValue=""
              rules={{ required: 'Country is required' }}
              render={({ field }) => (
                <Select id="country" placeholder="Select country" {...field}>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  {/* Add more countries here */}
                </Select>
              )}
            />
            <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
          </FormControl>

          {/* Category */}
          <FormControl isRequired isInvalid={errors.category}>
            <FormLabel htmlFor="category">Category</FormLabel>
            <Controller
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select id="category" placeholder="Select category" {...field}>
                  <option value="Web Development">Web Development</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Writing">Writing</option>
                </Select>
              )}
            />
            <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
          </FormControl>

          {/* Deadline */}
          <FormControl isRequired isInvalid={errors.deadline}>
            <FormLabel htmlFor="deadline">Deadline</FormLabel>
            <Input
              type="date"
              id="deadline"
              {...register('deadline', { required: 'Deadline is required' })}
            />
            <FormErrorMessage>{errors.deadline?.message}</FormErrorMessage>
          </FormControl>

          {/* Client Type */}
          <FormControl isRequired isInvalid={errors.userType}>
            <FormLabel htmlFor="userType">Client Type</FormLabel>
            <Controller
              name="userType"
              control={control}
              defaultValue=""
              rules={{ required: 'Client Type is required' }}
              render={({ field }) => (
                <Select id="userType" placeholder="Select client type" {...field} >
                  <option value="Student">Student</option>
                  <option value="Organization">Organization</option>
                </Select>
              )}
            />
            <FormErrorMessage>{errors.userType?.message}</FormErrorMessage>
          </FormControl>

          {/* Conditional Fields based on User Type */}
          {watch('userType') === 'Student' && (
            <>
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.contact}>
                <FormLabel htmlFor="contact">Contact</FormLabel>
                <Input
                  id="contact"
                  placeholder="Contact"
                  {...register('contact', {
                    required: 'Contact is required',
                    validate: validatePhoneNumber,
                  })}
                />
                <FormErrorMessage>{errors.contact?.message}</FormErrorMessage>
              </FormControl>
            </>
          )}

          {watch('userType') === 'Organization' && (
            <>
              <FormControl isRequired isInvalid={errors.companyName}>
                <FormLabel htmlFor="companyName">Company Name</FormLabel>
                <Input
                  id="companyName"
                  placeholder="Company Name"
                  {...register('companyName', { required: 'Company Name is required' })}
                />
                <FormErrorMessage>{errors.companyName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.companyEmail}>
                <FormLabel htmlFor="companyEmail">Company Email</FormLabel>
                <Input
                  id="companyEmail"
                  type="email"
                  placeholder="Company Email"
                  {...register('companyEmail', {
                    required: 'Company Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                <FormErrorMessage>{errors.companyEmail?.message}</FormErrorMessage>
              </FormControl>
            </>
          )}

          {/* Complexity */}
          <FormControl isRequired isInvalid={errors.taskComplexity}>
            <FormLabel htmlFor="taskComplexity">Complexity</FormLabel>
            <Controller
              name="taskComplexity"
              control={control}
              defaultValue=""
              rules={{ required: 'Complexity is required' }}
              render={({ field }) => (
                <Select
                  id="taskComplexity"
                  placeholder="Select complexity"
                  {...field}
                >
                  <option value="Simple">Simple</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Advanced">Advanced</option>
                </Select>
              )}
            />
            <FormErrorMessage>{errors.taskComplexity?.message}</FormErrorMessage>
          </FormControl>

          {/* Task Description */}
          <FormControl isRequired isInvalid={errors.taskDescription}>
            <FormLabel htmlFor="taskDescription">Task Description</FormLabel>
            <Textarea
              id="taskDescription"
              placeholder="Task Description"
              {...register('taskDescription', { required: 'Task Description is required' })}
            />
            <FormErrorMessage>{errors.taskDescription?.message}</FormErrorMessage>
          </FormControl>

          {/* File Upload */}
          <FormControl isRequired isInvalid={errors.files}>
            <FormLabel htmlFor="files">File Upload</FormLabel>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.md,.txt,.pages"
            />
            <FormErrorMessage>{errors.files?.message}</FormErrorMessage>
          </FormControl>

          {/* Display Selected Files */}
          {selectedFiles.length > 0 && (
            <VStack align="start" mt={4}>
              <Text fontWeight="bold">Selected Files:</Text>
              {selectedFiles.map((file, index) => (
                <HStack key={index} justifyContent="space-between" w="100%">
                  <Text>{file.name}</Text>
                  <CloseButton size="sm" onClick={() => handleRemoveFile(index)} />
                </HStack>
              ))}
            </VStack>
          )}

          {/* Budget Range */}
          <FormControl isRequired isInvalid={errors.budgetRange}>
            <FormLabel htmlFor="budgetRange">Budget Range</FormLabel>
            <Controller
              name="budgetRange"
              control={control}
              defaultValue=""
              rules={{ required: 'Budget Range is required' }}
              render={({ field }) => (
                <Select id="budgetRange" placeholder="Select budget range" {...field}>
                  <option value="$0 - $100">$0 - $100</option>
                  <option value="$101 – $500">$101 – $500</option>
                  <option value="$501 – $1000">$501 – $1000</option>
                  <option value="$1001 - $2000">$1001 - $2000</option>
                  <option value="Above $2000">Above $2000</option>
                </Select>
              )}
            />
            <FormErrorMessage>{errors.budgetRange?.message}</FormErrorMessage>
          </FormControl>

          {/* Additional Comments */}
          <FormControl>
            <FormLabel htmlFor="additionalComments">Additional Comments</FormLabel>
            <Textarea
              id="additionalComments"
              placeholder="Additional Comments"
              {...register('additionalComments')}
            />
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Submit Task
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TaskSubmissionForm;





