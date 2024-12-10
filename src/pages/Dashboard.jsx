import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Heading,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import useTransactionStore from '../stores/transactionStore'
import TransactionList from '../components/transactions/TransactionList'

function Dashboard() {
  const { transactions, getMonthlyTotal } = useTransactionStore()
  
  const monthlyIncome = getMonthlyTotal('income')
  const monthlyExpense = getMonthlyTotal('expense')
  const balance = monthlyIncome - monthlyExpense

  // Calculate category-wise expenses for the pie chart
  const categoryExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const pieData = Object.entries(categoryExpenses).map(([category, amount]) => ({
    name: category,
    value: amount
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      
      <StatGroup mb={8}>
        <Card flex={1} m={2}>
          <CardBody>
            <Stat>
              <StatLabel>Monthly Income</StatLabel>
              <StatNumber color="green.500">${monthlyIncome.toFixed(2)}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card flex={1} m={2}>
          <CardBody>
            <Stat>
              <StatLabel>Monthly Expenses</StatLabel>
              <StatNumber color="red.500">${monthlyExpense.toFixed(2)}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card flex={1} m={2}>
          <CardBody>
            <Stat>
              <StatLabel>Balance</StatLabel>
              <StatNumber color={balance >= 0 ? "green.500" : "red.500"}>
                ${balance.toFixed(2)}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </StatGroup>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} mb={8}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Expense Distribution</Heading>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Recent Transactions</Heading>
            <TransactionList limit={5} />
          </CardBody>
        </Card>
      </Grid>
    </Box>
  )
}

export default Dashboard 