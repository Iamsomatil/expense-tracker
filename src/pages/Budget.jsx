import {
  Box,
  Heading,
  Grid,
  Progress,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Card,
  CardBody,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useBudgetStore from '../stores/budgetStore'
import useTransactionStore from '../stores/transactionStore'

function Budget() {
  const { currentUser } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { budgets, fetchBudgets, addBudget, getBudgetProgress } = useBudgetStore()
  const { categories } = useTransactionStore()
  const toast = useToast()

  const [newBudget, setNewBudget] = useState({
    categoryId: '',
    amount: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  })

  useEffect(() => {
    if (currentUser) {
      fetchBudgets(currentUser.uid)
    }
  }, [currentUser, fetchBudgets])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await addBudget(currentUser.uid, {
      ...newBudget,
      amount: Number(newBudget.amount)
    })

    if (success) {
      toast({
        title: 'Budget created successfully',
        status: 'success',
        duration: 3000
      })
      onClose()
      setNewBudget({
        categoryId: '',
        amount: '',
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      })
    } else {
      toast({
        title: 'Error creating budget',
        status: 'error',
        duration: 3000
      })
    }
  }

  return (
    <Box>
      <Heading mb={6}>Budget Management</Heading>

      <Button colorScheme="brand" mb={6} onClick={onOpen}>
        Create New Budget
      </Button>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        {budgets.map(budget => {
          const progress = getBudgetProgress(budget.categoryId)
          const category = categories.find(c => c.id === budget.categoryId)
          
          return (
            <Card key={budget.id}>
              <CardBody>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  {category?.name || budget.categoryId}
                </Text>
                <Text mb={2}>
                  Budget: ${budget.amount.toFixed(2)}
                </Text>
                <Text mb={2}>
                  Spent: ${progress?.spent.toFixed(2) || '0.00'}
                </Text>
                <Progress
                  value={progress?.percentage || 0}
                  colorScheme={progress?.percentage > 100 ? 'red' : 'green'}
                  mb={2}
                />
                <Text fontSize="sm" color={progress?.percentage > 100 ? 'red.500' : 'green.500'}>
                  {progress?.remaining > 0 
                    ? `$${progress.remaining.toFixed(2)} remaining`
                    : `$${Math.abs(progress?.remaining).toFixed(2)} over budget`
                  }
                </Text>
              </CardBody>
            </Card>
          )
        })}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Budget</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={newBudget.categoryId}
                    onChange={(e) => setNewBudget({
                      ...newBudget,
                      categoryId: e.target.value
                    })}
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter(cat => cat.type === 'expense')
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    }
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Budget Amount</FormLabel>
                  <Input
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({
                      ...newBudget,
                      amount: e.target.value
                    })}
                  />
                </FormControl>

                <Button type="submit" colorScheme="brand" width="full">
                  Create Budget
                </Button>
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Budget 