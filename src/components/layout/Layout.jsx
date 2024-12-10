import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

function Layout() {
  const bgColor = useColorModeValue('gray.50', 'gray.800')

  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" bg={bgColor}>
        <Header />
        <Box as="main" p={8}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}

export default Layout