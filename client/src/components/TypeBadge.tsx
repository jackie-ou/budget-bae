import { personName } from "@/lib/finance";
import type { Expense } from "@/lib/types";

/** "Shared" for split expenses, otherwise "Dorothy's" / "Jackie's". */
export function TypeBadge({ expense }: { expense: Pick<Expense, "expense_type" | "personal_owner"> }) {
  if (expense.expense_type === "shared" || !expense.personal_owner) {
    return (
      <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
        Shared
      </span>
    );
  }
  return (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
      {personName(expense.personal_owner)}'s
    </span>
  );
}
