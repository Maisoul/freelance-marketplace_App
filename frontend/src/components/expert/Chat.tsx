
import { Box, Heading, Textarea, Button, VStack, List, ListItem, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { fetchExpertChat, sendExpertChatMessage } from '../../services/expertApi';
import type { ChatMessage } from '../../services/expertApi';

interface ChatProps {
  projectId?: string;
}

export default function Chat({ projectId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  // Fetch messages
  const loadMessages = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const msgs = await fetchExpertChat(projectId);
      setMessages(msgs);
      setError(null);
    } catch {
      setError('Failed to load chat messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  if (pollingRef.current) clearInterval(pollingRef.current);
  pollingRef.current = window.setInterval(loadMessages, 5000);
  return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    // eslint-disable-next-line
  }, [projectId]);

  const sendMessage = async () => {
    if (!input.trim() || !projectId) return;
    try {
      await sendExpertChatMessage(projectId, input);
      setInput('');
      loadMessages();
    } catch {
      setError('Failed to send message.');
    }
  };

  if (!projectId) return <Alert status="warning"><AlertIcon />No project selected for chat.</Alert>;
  if (loading) return <Spinner />;

  return (
    <Box>
      <Heading size="md" mb={2}>Chat with Client</Heading>
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
