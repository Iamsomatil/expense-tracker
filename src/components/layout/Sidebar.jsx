import {
  Box,
  VStack,
  Icon,
  Text,
  Flex,
  useColorModeValue
} from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiDollarSign, FiPieChart, FiBarChart2 } from 'react-icons/fi'
import PropTypes from 'prop-types'

const NavItem = ({ icon, children, to }) => {
  NavItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    children: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }

  const activeBg = useColorModeValue('brand.50', 'brand.900')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')

  return (
    <NavLink to={to} style={{ width: '100%' }}>
      {({ isActive }) => (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? activeBg : 'transparent'}
          _hover={{ bg: hoverBg }}
        >
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
          <Text>{children}</Text>
        </Flex>
      )}
    </NavLink>
  )
}

function Sidebar() {
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Box
      w="64"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="brand.500">
          ExpenseEase
        </Text>
      </Flex>
      <VStack spacing={4} align="stretch" mt={8}>
        <NavItem icon={FiHome} to="/">Dashboard</NavItem>
        <NavItem icon={FiDollarSign} to="/transactions">Transactions</NavItem>
        <NavItem icon={FiPieChart} to="/budget">Budget</NavItem>
        <NavItem icon={FiBarChart2} to="/reports">Reports</NavItem>
      </VStack>
    </Box>
  )
}

export default Sidebar