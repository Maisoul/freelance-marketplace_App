
import { Box, Heading, List, ListItem, Text, Textarea, Button, VStack, Spinner, Alert, AlertIcon, Input, NumberInput, NumberInputField } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { fetchClientReviews, submitClientReview } from '../../services/reviewApi';
import type { Review } from '../../services/reviewApi';


export default function ReviewSection() {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [taskId, setTaskId] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClientReviews()
      .then(setReviews)
      .catch(() => setError('Failed to load reviews.'))
      .finally(() => setLoading(false));
  }, []);

  const submitReview = async () => {
    if (!review.trim() || !taskId) return;
    setSubmitting(true);
    try {
      const newReview = await submitClientReview({ task: Number(taskId), rating, comment: review });
      setReviews((prev) => [...prev, newReview]);
      setReview('');
      setTaskId('');
      setRating(5);
    } catch {
      setError('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading size="md" mb={2}>Feedback & Reviews</Heading>
      <List spacing={2}>
        {reviews.map((r) => (
          <ListItem key={r.id}>
            <Text><b>{r.reviewer}:</b> {r.comment} <i>({new Date(r.created_at).toLocaleDateString()})</i> | Rating: {r.rating}</Text>
          </ListItem>
        ))}
      </List>
      <VStack mt={4} spacing={2} align="stretch">
        <Input placeholder="Task ID" value={taskId} onChange={e => setTaskId(e.target.value)} />
        <NumberInput min={1} max={5} value={rating} onChange={(_, n) => setRating(Number(n) || 5)}>
          <NumberInputField placeholder="Rating (1-5)" />
        </NumberInput>
        <Textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Leave a review..." />
        <Button onClick={submitReview} colorScheme="blue" isLoading={submitting}>Submit Review</Button>
      </VStack>
    </Box>
  );
}
