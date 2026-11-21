import type { ReactNode } from "react";

import { budgetStatus, usd } from "@/lib/finance";
import { cn } from "@/lib/utils";

interface BudgetBarProps {
  label: ReactNode;
  spent: number;
  budget: number;
}

/** Progress bar that turns yellow at 80% and red when over budget. */
export function BudgetBar({ label, spent, budget }: BudgetBarProps) {
  const status = budgetStatus(spent, budget);
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const color = status === "over" ? "bg-danger" : status === "warn" ? "bg-warning" : "bg-success";
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {usd(spent, false)} <span className="opacity-60">/ {usd(budget, false)}</span>
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(Math.min(pct, 100))}
      >
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{Math.round(pct)}% used</span>
        <span className={cn(status === "over" && "text-danger")}>
          {spent > budget ? `${usd(spent - budget, false)} over` : `${usd(budget - spent, false)} left`}
        </span>
      </div>
    </div>
  );
}
