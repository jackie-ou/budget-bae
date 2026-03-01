import { AddExpenseForm } from "./components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import expensesData from "@/data/expenses.json";
import {
  Example,
  ExampleWrapper,
} from "@/components/example"

export function App() {
  return (
    <>
      <ExampleWrapper>
        <Example title="Add Expense Form" className="items-center justify-center">
          <AddExpenseForm />
        </Example>
        <Example title="Expense List" className="items-center">
          <ExpenseList expenses={expensesData} />
        </Example>
      </ExampleWrapper>
    </>
  );
}

export default App;