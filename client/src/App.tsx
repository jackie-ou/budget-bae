import { ExpenseList } from "@/components/ExpenseList";
import expensesData from "@/data/expenses.json";
import { useState, useEffect } from 'react'
import { supabase } from "./utils/supabase";
import { AddExpenseButton } from "./components/AddExpenseButton";
import { Toaster } from "sonner";

export function App() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    async function getTransactions() {
      const { data: transactions } = await supabase.from('transactions').select()

      if (transactions) {
        setTransactions(transactions)
      }
    }

    getTransactions()
  }, [])


  return (
    <>
      <Toaster />
      <section className="grid place-items-center h-screen">
        <ExpenseList expenses={transactions} />
        <AddExpenseButton />
      </section>
    </>
  );
}

export default App;