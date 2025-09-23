import axios from './axios';

export interface Review {
  id: number;
  task: number;
  reviewer: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Fetch all reviews (admin or for current user if backend filters)
export async function fetchReviews(): Promise<Review[]> {
  const response = await axios.get('/api/messages/reviews/');
  return response.data;
}

export async function fetchTaskReviews(taskId: number): Promise<Review[]> {
  const response = await axios.get('/api/messages/reviews/', { params: { task: taskId } });
  return response.data;
}

// Submit a new review
export async function submitReview(data: {
  task: number;
  rating: number;
  comment: string;
}): Promise<Review> {
  const response = await axios.post('/api/messages/reviews/', data);
  return response.data;
}
