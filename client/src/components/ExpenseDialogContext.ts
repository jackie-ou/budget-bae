import { createContext, useContext } from "react";

import type { Expense } from "@/lib/types";

export interface ExpenseDialogApi {
  openNew: () => void;
  openEdit: (expense: Expense) => void;
}

export const ExpenseDialogContext = createContext<ExpenseDialogApi | null>(null);

/** Opens the shared add/edit expense dialog from anywhere in the app. */
export function useExpenseDialog() {
  const ctx = useContext(ExpenseDialogContext);
  if (!ctx) throw new Error("useExpenseDialog must be used inside <ExpenseDialogProvider>");
  return ctx;
}
