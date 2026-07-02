import { ExpenseList } from "@/components/ExpenseList";
import expensesData from "@/data/expenses.json";
import { useState, useEffect } from 'react'
import { supabase } from "./utils/supabase";

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
      <section className="grid place-items-center h-screen">
        <ExpenseList expenses={transactions} />
      </section>
    </>
  );
}

export default App;