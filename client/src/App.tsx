import { ComponentExample } from "@/components/component-example";
import { ExpenseList } from "@/components/ExpenseList";
import expensesData from "@/data/expenses.json";

export function App() {
  return (
    <>
      <ExpenseList expenses={expensesData}/>
      <ComponentExample />
    </>
  );
}

export default App;