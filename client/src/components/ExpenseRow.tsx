import { format } from "date-fns";
import { Lock } from "lucide-react";

import { PersonDot } from "@/components/PersonDot";
import { TypeBadge } from "@/components/TypeBadge";
import { parseDay, personName, usd } from "@/lib/finance";
import type { Expense } from "@/lib/types";

interface ExpenseRowProps {
  expense: Expense;
  onClick?: () => void;
  /** Shows a lock icon when the expense's month is settled and locked. */
  locked?: boolean;
}

export function ExpenseRow({ expense: e, onClick, locked }: ExpenseRowProps) {
  const date = parseDay(e.expense_date);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-xl bg-muted text-[10px] leading-tight text-muted-foreground">
        <span className="font-semibold uppercase">{format(date, "MMM")}</span>
        <span className="text-sm font-semibold text-foreground">{format(date, "d")}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{e.title}</span>
          {locked && <Lock className="size-3 shrink-0 text-muted-foreground" aria-label="Locked" />}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>{e.category}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <PersonDot person={e.card_owner} />
            {personName(e.card_owner)}'s card
          </span>
          <TypeBadge expense={e} />
        </div>
      </div>
      <span className="font-semibold tabular-nums">{usd(e.amount)}</span>
    </button>
  );
}
