import { Expense } from "@/components/Expense";
import type { ExpenseType } from "@/types/expense";

export function ExpenseList({ expenses }: { expenses: ExpenseType[] }) {
  return (
    <section className="mx-auto w-full max-w-sm flex flex-col">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Expenses</h2>
      <div className="expense-list flex flex-col gap-4">
        {expenses.map((item) => (
          <Expense key={item.id} expense={item} />
        ))}
      </div>
    </section>
  )
}