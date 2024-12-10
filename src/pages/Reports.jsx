import {
  Box,
  Heading,
  Grid,
  Select,
  Card,
  CardBody,
  Text,
  Stack,
  Flex,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import useTransactionStore from '../stores/transactionStore'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

function Reports() {
  const { transactions, categories } = useTransactionStore()
  const [timeRange, setTimeRange] = useState('3') // months

  // Prepare data for charts
  const chartData = useMemo(() => {
    const now = new Date()
    const monthsAgo = subMonths(now, parseInt(timeRange))
    
    // Filter transactions within selected time range
    const filteredTransactions = transactions.filter(t => {
      const date = new Date(t.date)
      return date >= startOfMonth(monthsAgo) && date <= endOfMonth(now)
    })

    // Monthly income vs expenses
    const monthlyData = filteredTransactions.reduce((acc, t) => {
      const month = format(new Date(t.date), 'MMM yyyy')
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 }
      }
      if (t.type === 'income') {
        acc[month].income += t.amount
      } else {
        acc[month].expenses += t.amount
      }
      return acc
    }, {})

    // Category-wise expenses
    const categoryData = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = categories.find(c => c.id === t.category)?.name || t.category
        acc[category] = (acc[category] || 0) + t.amount
        return acc
      }, {})

    return {
      monthly: Object.values(monthlyData),
      category: Object.entries(categoryData).map(([name, value]) => ({
        name,
        value
      }))
    }
  }, [transactions, categories, timeRange])

  // Calculate totals
  const totals = useMemo(() => {
    const income = chartData.monthly.reduce((sum, m) => sum + m.income, 0)
    const expenses = chartData.monthly.reduce((sum, m) => sum + m.expenses, 0)
    return {
      income,
      expenses,
      balance: income - expenses
    }
  }, [chartData])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Financial Reports</Heading>
        <Select
          width="200px"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="3">Last 3 months</option>
          <option value="6">Last 6 months</option>
          <option value="12">Last 12 months</option>
        </Select>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={6} mb={8}>
        <Card>
          <CardBody>
            <Stack>
              <Text fontSize="lg">Total Income</Text>
              <Text fontSize="2xl" color="green.500">
                ${totals.income.toFixed(2)}
              </Text>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stack>
              <Text fontSize="lg">Total Expenses</Text>
              <Text fontSize="2xl" color="red.500">
                ${totals.expenses.toFixed(2)}
              </Text>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stack>
              <Text fontSize="lg">Net Balance</Text>
              <Text
                fontSize="2xl"
                color={totals.balance >= 0 ? 'green.500' : 'red.500'}
              >
                ${totals.balance.toFixed(2)}
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Income vs Expenses</Heading>
            <Box height="400px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#48BB78" name="Income" />
                  <Bar dataKey="expenses" fill="#F56565" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Expense Distribution</Heading>
            <Box height="400px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.category}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.category.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  )
}

export default Reports 