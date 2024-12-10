import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  VStack,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import useTransactionStore from '../../stores/transactionStore'

function TransactionForm() {
  const { currentUser } = useAuth()
  const { categories, addTransaction } = useTransactionStore()
  const toast = useToast()

  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const transaction = {
      ...formData,
      amount: Number(formData.amount),
      createdAt: new Date().toISOString()
    }

    const success = await addTransaction(currentUser.uid, transaction)
    if (success) {
      toast({
        title: 'Transaction added',
        status: 'success',
        duration: 3000
      })
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      })
    } else {
      toast({
        title: 'Error adding transaction',
        status: 'error',
        duration: 3000
      })
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="">Select category</option>
            {categories
              .filter(cat => cat.type === formData.type)
              .map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            }
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Amount</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </FormControl>

        <Button type="submit" colorScheme="brand" width="full">
          Add Transaction
        </Button>
      </VStack>
    </Box>
  )
}

export default TransactionForm 