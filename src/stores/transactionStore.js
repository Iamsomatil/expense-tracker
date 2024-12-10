import { create } from 'zustand'
import { db } from '../config/firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore'

const useTransactionStore = create((set, get) => ({
  transactions: [],
  categories: [
    { id: 'food', name: 'Food & Dining', type: 'expense' },
    { id: 'transport', name: 'Transportation', type: 'expense' },
    { id: 'utilities', name: 'Utilities', type: 'expense' },
    { id: 'shopping', name: 'Shopping', type: 'expense' },
    { id: 'salary', name: 'Salary', type: 'income' },
    { id: 'investment', name: 'Investment', type: 'income' },
  ],
  loading: false,
  error: null,

  // Actions
  fetchTransactions: async (userId) => {
    set({ loading: true })
    try {
      const q = query(
        collection(db, `users/${userId}/transactions`),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      set({ transactions, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  addTransaction: async (userId, transaction) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${userId}/transactions`),
        transaction
      )
      set(state => ({
        transactions: [{id: docRef.id, ...transaction}, ...state.transactions]
      }))
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  deleteTransaction: async (userId, transactionId) => {
    try {
      await deleteDoc(doc(db, `users/${userId}/transactions/${transactionId}`))
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== transactionId)
      }))
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  // Computed values
  getMonthlyTotal: (type) => {
    const transactions = get().transactions
    const currentMonth = new Date().getMonth()
    return transactions
      .filter(t => 
        new Date(t.date).getMonth() === currentMonth && 
        t.type === type
      )
      .reduce((sum, t) => sum + t.amount, 0)
  }
}))

export default useTransactionStore 