import { ChakraProvider, Box } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { theme } from './theme'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Box minH="100vh">
            <AppRoutes />
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App