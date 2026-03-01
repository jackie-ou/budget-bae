import { Expense } from '@/components/Expense';
import expensesData from "@/data/expenses.json";

export default {
  title: 'Expense',
  component: Expense,
}

export const Primary = {
  args: {
    expense: expensesData[0],
  }
}