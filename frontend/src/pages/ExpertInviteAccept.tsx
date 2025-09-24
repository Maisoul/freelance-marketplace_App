import React, { useState } from "react";
import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, Alert, AlertIcon, Container } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const ExpertInviteAccept: React.FC = () => {
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("http://localhost:8000/api/accounts/invite/expert/accept/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Account created! You can now log in.");
    } else {
      setMessage(data.error || "Something went wrong.");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <Container maxW="md" py={10}>
        <Alert status="error">
          <AlertIcon />
          Invalid or missing invite token.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={10}>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Heading size="lg" textAlign="center">Accept Expert Invite</Heading>
          
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>
          
          <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Submitting...">
            Accept Invite
          </Button>
          
          {message && (
            <Alert status={message.includes("created") ? "success" : "error"}>
              <AlertIcon />
              {message}
            </Alert>
          )}
        </VStack>
      </Box>
    </Container>
  );
};

export default ExpertInviteAccept;
