import axios from './axios';

export interface ChatbotMessage {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

// Fetch chatbot messages (optional, for history)
export async function fetchChatbotMessages(): Promise<ChatbotMessage[]> {
  const response = await axios.get('/api/admin/chatbot/');
  return response.data;
}

// Send a message to the chatbot
export async function sendChatbotMessage(text: string): Promise<ChatbotMessage> {
  const response = await axios.post('/api/admin/chatbot/', { text });
  return response.data;
}
