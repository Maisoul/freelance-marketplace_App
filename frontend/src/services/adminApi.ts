
import axios from './axios';

// Invite a new expert (admin)
export async function inviteExpert(email: string): Promise<{ success: boolean; message: string; invite_url?: string }> {
  const response = await axios.post('/api/accounts/invite/expert/', { email });
  const data = response.data;
  return { success: true, message: data.detail || 'Invite sent.', invite_url: data.invite_url };
}
// Fetch all projects (admin)
export async function fetchAllProjects(): Promise<AdminTask[]> {
  const response = await axios.get('/api/tasks/');
  return response.data?.results ?? response.data;
}

// Assign expert to a project
export async function assignExpertToProject(projectId: number, expertId: number): Promise<AdminTask> {
  const response = await axios.post(`/api/tasks/${projectId}/assign_expert/`, { expert_id: expertId });
  return response.data;
}

export async function markTaskCompleted(projectId: number): Promise<AdminTask> {
  const response = await axios.post(`/api/tasks/${projectId}/mark_completed/`);
  return response.data;
}

export interface AdminTask {
  id: number;
  title: string;
  description: string;
  status: string;
  deadline?: string;
  time_to_deadline?: string;
  assigned_expert?: number | null;
  client?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
  } | null;
  created_at: string;
}

// Fetch all tasks (admin)
export async function fetchAllTasks(): Promise<AdminTask[]> {
  const response = await axios.get('/api/tasks/');
  return response.data?.results ?? response.data;
}
