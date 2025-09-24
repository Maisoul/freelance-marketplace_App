import axios from './axios';

// Chat message type
export interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

// Fetch chat messages for a project
export async function fetchExpertChat(projectId: string): Promise<ChatMessage[]> {
  const response = await axios.get(`/api/expert/chat/${projectId}/`);
  return response.data;
}

// Send a chat message
export async function sendExpertChatMessage(projectId: string, text: string): Promise<ChatMessage> {
  const response = await axios.post(`/api/expert/chat/${projectId}/`, { text });
  return response.data;
}

// Submit work for a project as an expert
export async function submitExpertWork(data: {
  projectId: string;
  notes: string;
  file: File | null;
}): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append('project_id', data.projectId);
  formData.append('notes', data.notes);
  if (data.file) formData.append('file', data.file);
  const response = await axios.post('/api/expert/submit/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export interface Project {
  id: number;
  title: string;
  deadline: string;
  status: string;
}

// Fetch projects assigned to the current expert
export async function fetchExpertProjects(): Promise<Project[]> {
  const response = await axios.get('/api/expert/projects/');
  return response.data;
}
