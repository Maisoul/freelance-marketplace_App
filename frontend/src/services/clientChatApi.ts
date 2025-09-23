import axios from './axios';

export interface ClientChatMessage {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

// Fetch chat messages for a task
export async function fetchClientChat(taskId: string): Promise<ClientChatMessage[]> {
  const response = await axios.get(`/api/client/chat/${taskId}/`);
  return response.data;
}

// Send a chat message
export async function sendClientChatMessage(taskId: string, text: string): Promise<ClientChatMessage> {
  const response = await axios.post(`/api/client/chat/${taskId}/`, { text });
  return response.data;
}
