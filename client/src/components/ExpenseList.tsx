import { Expense } from "@/components/Expense";
import type { ExpenseType } from "@/types/expense";
import { MonthHeading } from "@/components/MonthHeading";

export function ExpenseList({ expenses }: { expenses: ExpenseType[] }) {
  return (
    <section className="mx-auto w-full max-w-sm flex flex-col">
      <MonthHeading />
      <div className="expense-list flex flex-col gap-4">
        {expenses.map((item) => (
          <Expense key={item.id} expense={item} />
        ))}
      </div>
    </section>
  )
}