
import { Box, Heading, Textarea, Button, VStack, List, ListItem, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { fetchChatbotMessages, sendChatbotMessage } from '../../services/chatbotApi';
import type { ChatbotMessage } from '../../services/chatbotApi';

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const msgs = await fetchChatbotMessages();
      setMessages(msgs);
      setError(null);
    } catch {
      setError('Failed to load chatbot messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = window.setInterval(loadMessages, 5000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await sendChatbotMessage(input);
      setInput('');
      loadMessages();
    } catch {
      setError('Failed to send message.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box>
      <Heading size="md" mb={2}>AI Chatbot</Heading>
      <VStack spacing={2} align="stretch">
        {error && <Alert status="error"><AlertIcon />{error}</Alert>}
        <List spacing={1} maxH="150px" overflowY="auto">
          {messages.map((msg) => (
            <ListItem key={msg.id}>
              <Text><b>{msg.sender}:</b> {msg.text}</Text>
            </ListItem>
          ))}
        </List>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." />
        <Button onClick={sendMessage} colorScheme="blue">Send</Button>
      </VStack>
    </Box>
  );
}
