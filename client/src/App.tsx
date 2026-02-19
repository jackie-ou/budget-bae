import { ComponentExample } from "@/components/component-example";
import { AddExpenseForm } from "./components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import expensesData from "@/data/expenses.json";

export function App() {
  return (
    <>
      <AddExpenseForm />
      <ExpenseList expenses={expensesData} />
      <ComponentExample />
    </>
  );
}

export default App;