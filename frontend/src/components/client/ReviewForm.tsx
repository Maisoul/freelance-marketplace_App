import {
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Select
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface ReviewFormProps {
  onSubmit: (data: { rating: string; reviewText: string }) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const { handleSubmit, register, formState: { errors } } = useForm();

  const submitHandler = (data: any) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel htmlFor="rating">Rating (1-5)</FormLabel>
          <Select id="rating" {...register('rating', { required: 'Rating is required' })}>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="reviewText">Review</FormLabel>
          <Textarea id="reviewText" placeholder="Write your review here" {...register('reviewText' )} />
        </FormControl>
        <Button type="submit" colorScheme="blue">Submit Review</Button>
      </VStack>
    </form>
  );
};

export default ReviewForm;