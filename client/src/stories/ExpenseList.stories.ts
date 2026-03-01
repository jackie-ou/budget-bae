import { ExpenseList } from '@/components/ExpenseList';
import expensesData from "@/data/expenses.json";

export default {
  title: 'Expense List',
  component: ExpenseList,
}

export const Primary = {
  args: {
    expenses: expensesData,
  }
}