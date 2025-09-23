import axios from './axios';

export interface ClientTask {
  id: number;
  title: string;
  description: string;
  status: string;
  assigned_expert?: string;
  created_at: string;
}

// Fetch all tasks for the current client
export async function fetchClientTasks(): Promise<ClientTask[]> {
  const response = await axios.get('/api/client/tasks/');
  return response.data;
}

// Create a new task
// Accept FormData for file upload and all fields
export async function createClientTask(data: FormData): Promise<ClientTask> {
  const response = await axios.post('/api/client/tasks/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
