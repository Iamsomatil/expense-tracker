import { 
  Box, 
  Flex, 
  IconButton, 
  useColorMode, 
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar
} from '@chakra-ui/react'
import { FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <Box bg={bgColor} px={4} py={2} shadow="sm">
      <Flex justify="flex-end" align="center" maxW="1200px" mx="auto">
        <IconButton
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          variant="ghost"
          mr={4}
          aria-label="Toggle color mode"
        />
        
        <Menu>
          <MenuButton>
            <Avatar size="sm" name={currentUser?.email} />
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
              Profile
            </MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  )
}

export default Header