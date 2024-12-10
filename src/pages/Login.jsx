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
  Divider,
  Center
} from '@chakra-ui/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FcGoogle } from 'react-icons/fc'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.700')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
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

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
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
            ExpenseEase
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
              <Button
                type="submit"
                colorScheme="brand"
                isLoading={loading}
              >
                Sign in
              </Button>
            </Stack>
          </form>
          
          <Divider />
          
          <Button
            w="full"
            variant="outline"
            leftIcon={<FcGoogle />}
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
          
          <Stack direction="row" justify="space-between" fontSize="sm">
            <Link to="/forgot-password">
              <Text color="brand.500">Forgot Password?</Text>
            </Link>
            <Link to="/register">
              <Text color="brand.500">Create account</Text>
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Center>
  )
}

export default Login