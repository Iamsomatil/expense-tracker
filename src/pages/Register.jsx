import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Center
} from '@chakra-ui/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.700')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }

    setLoading(true)
    try {
      await signup(email, password)
      navigate('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    setLoading(false)
  }

  return (
    <Center minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Box
        bg={bgColor}
        p={8}
        rounded="lg"
        shadow="lg"
        maxW="md"
        w="full"
      >
        <Stack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="brand.500">
            Create Account
          </Text>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
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
                  required
                />
              </FormControl>
              <FormControl id="confirm-password">
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="brand"
                isLoading={loading}
              >
                Sign up
              </Button>
            </Stack>
          </form>
          
          <Text fontSize="sm" textAlign="center">
            Already have an account?{' '}
            <Link to="/login">
              <Text as="span" color="brand.500">
                Sign in
              </Text>
            </Link>
          </Text>
        </Stack>
      </Box>
    </Center>
  )
}

export default Register