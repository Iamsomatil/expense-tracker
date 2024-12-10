import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Heading,
  useColorModeValue,
  Stack,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const [error, setError] = useState('');
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.700');

  async function handleSubmit(e) {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      if (email !== currentUser.email) {
        await updateEmail(email);
      }
      if (password) {
        await updatePassword(password);
      }
      
      setPassword('');
      setConfirmPassword('');
      setError('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box maxW="container.md" mx="auto">
      <Card bg={bgColor} shadow="lg">
        <CardBody>
          <Stack spacing={6}>
            <Heading size="lg" textAlign="center" color="brand.500">Profile Settings</Heading>
            
            {error && (
              <Alert status={error.includes('successfully') ? 'success' : 'error'}>
                <AlertIcon />
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>

                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep the same"
                  />
                </FormControl>

                <FormControl id="password-confirm">
                  <FormLabel>Password Confirmation</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave blank to keep the same"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={loading}
                  mt={4}
                >
                  Update Profile
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
