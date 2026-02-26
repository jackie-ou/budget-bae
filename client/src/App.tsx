import { ExpenseList } from "@/components/ExpenseList";
import expensesData from "@/data/expenses.json";

export function App() {
  return (
    <>
      <section className="grid place-items-center h-screen">
        <ExpenseList expenses={expensesData} />
      </section>
    </>
  );
}

export default App;