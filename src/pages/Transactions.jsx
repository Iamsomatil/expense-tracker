import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useTransactionStore from "../stores/transactionStore";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

function Transactions() {
  const { currentUser } = useAuth();
  const { fetchTransactions } = useTransactionStore();
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    if (currentUser) {
      fetchTransactions(currentUser.uid);
    }
  }, [currentUser, fetchTransactions]);

  return (
    <Box>
      <Heading mb={6}>Transactions</Heading>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Transaction List</Tab>
          <Tab>Add Transaction</Tab>
        </TabList>

        <TabPanels>
          <TabPanel bg={bgColor} borderRadius="md">
            <TransactionList />
          </TabPanel>

          <TabPanel bg={bgColor} borderRadius="md">
            <TransactionForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Transactions;
