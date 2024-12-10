import { create } from 'zustand'
import { db } from '../config/firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore'

const useBudgetStore = create((set, get) => ({
  budgets: [],
  loading: false,
  error: null,

  fetchBudgets: async (userId) => {
    set({ loading: true })
    try {
      const q = query(
        collection(db, `users/${userId}/budgets`),
        where('month', '==', new Date().getMonth())
      )
      const querySnapshot = await getDocs(q)
      const budgets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      set({ budgets, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  addBudget: async (userId, budget) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${userId}/budgets`),
        budget
      )
      set(state => ({
        budgets: [...state.budgets, { id: docRef.id, ...budget }]
      }))
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  deleteBudget: async (userId, budgetId) => {
    try {
      await deleteDoc(doc(db, `users/${userId}/budgets/${budgetId}`))
      set(state => ({
        budgets: state.budgets.filter(b => b.id !== budgetId)
      }))
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  getBudgetProgress: (categoryId) => {
    const budget = get().budgets.find(b => b.categoryId === categoryId)
    if (!budget) return null

    const transactions = useTransactionStore.getState().transactions
    const spent = transactions
      .filter(t => 
        t.category === categoryId && 
        new Date(t.date).getMonth() === budget.month
      )
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      budget: budget.amount,
      spent,
      remaining: budget.amount - spent,
      percentage: (spent / budget.amount) * 100
    }
  }
}))

export default useBudgetStore 