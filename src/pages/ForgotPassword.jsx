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
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.700')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      toast({
        title: 'Success',
        description: 'Check your email for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
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
            Reset Password
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
              <Button
                type="submit"
                colorScheme="brand"
                isLoading={loading}
              >
                Reset Password
              </Button>
            </Stack>
          </form>
          
          <Stack direction="row" justify="space-between" fontSize="sm">
            <Link to="/login">
              <Text color="brand.500">Back to Login</Text>
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Center>
  )
}

export default ForgotPassword