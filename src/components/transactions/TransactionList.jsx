import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Text
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import useTransactionStore from '../../stores/transactionStore'
import { format } from 'date-fns'

function TransactionList() {
  const { currentUser } = useAuth()
  const { transactions, categories, deleteTransaction } = useTransactionStore()

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : categoryId
  }

  const handleDelete = async (transactionId) => {
    await deleteTransaction(currentUser.uid, transactionId)
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Category</Th>
            <Th>Description</Th>
            <Th isNumeric>Amount</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map(transaction => (
            <Tr key={transaction.id}>
              <Td>{format(new Date(transaction.date), 'MMM dd, yyyy')}</Td>
              <Td>{getCategoryName(transaction.category)}</Td>
              <Td>{transaction.description}</Td>
              <Td isNumeric>${transaction.amount.toFixed(2)}</Td>
              <Td>
                <Badge
                  colorScheme={transaction.type === 'income' ? 'green' : 'red'}
                >
                  {transaction.type}
                </Badge>
              </Td>
              <Td>
                <IconButton
                  aria-label="Delete transaction"
                  icon={<FiTrash2 />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(transaction.id)}
                />
              </Td>
            </Tr>
          ))}
          {transactions.length === 0 && (
            <Tr>
              <Td colSpan={6}>
                <Text textAlign="center">No transactions found</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  )
}

export default TransactionList 