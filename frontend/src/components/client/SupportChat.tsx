import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  List,
  ListItem,
  Text,
  Textarea,
  Button,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';

interface ChatMessage {
  sender: string;
  text: string;
}

const SupportChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current?.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/chatbot/', { message: input });
      const reply = response.data.reply;

      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'You', text: input },
        { sender: 'Support', text: reply },
      ]);

      setInput('');
      setError(null);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <VStack spacing={2} align="stretch">
        <Box
          ref={chatboxRef}
          borderWidth="1px"
          borderRadius="md"
          p={2}
          height="200px"
          overflowY="scroll"
        >
          <List spacing={1}>
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <Text fontWeight={msg.sender === 'You' ? 'bold' : 'normal'}>
                  {msg.sender}: {msg.text}
                </Text>
              </ListItem>
            ))}
          </List>
        </Box>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button isLoading={loading} colorScheme="blue" onClick={sendMessage}>
          Send
        </Button>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default SupportChat;
