import { ComponentExample } from "@/components/component-example";
import { AddExpenseForm } from "./components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { DatePicker } from "@/components/DatePicker";
import expensesData from "@/data/expenses.json";

export function App() {
  return (
    <>
      <AddExpenseForm />
      <ExpenseList expenses={expensesData} />
      <DatePicker />
      <ComponentExample />
    </>
  );
}

export default App;