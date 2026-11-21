import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { monthKey } from "@/lib/finance";
import type { Budget, ExpenseInput, MonthSettlementPatch } from "@/lib/types";

/**
 * React Query hooks over the API layer. Components only use these hooks,
 * never `api` directly, so the backend can change without touching UI code.
 */

export const queryKeys = {
  expenses: ["expenses"],
  categories: ["categories"],
  budgets: ["budgets"],
  settlements: ["month_settlements"],
} as const;

export function useExpenses() {
  return useQuery({ queryKey: queryKeys.expenses, queryFn: () => api.listExpenses() });
}

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: () => api.listCategories() });
}

export function useBudgets() {
  return useQuery({ queryKey: queryKeys.budgets, queryFn: () => api.listBudgets() });
}

export function useSettlements() {
  return useQuery({ queryKey: queryKeys.settlements, queryFn: () => api.listSettlements() });
}

/** Budgets for a month, falling back to the most recent earlier month. */
export function budgetsFor(budgets: Budget[] | undefined, month: string) {
  const out = { household: 0, dorothy: 0, jackie: 0 };
  for (const kind of ["household", "dorothy", "jackie"] as const) {
    const match = (budgets ?? [])
      .filter((b) => b.kind === kind && b.month <= month)
      .sort((a, b) => b.month.localeCompare(a.month))[0];
    out[kind] = match?.amount ?? 0;
  }
  return out;
}

/** Returns a function that tells whether the month containing a date is locked. */
export function useIsLocked() {
  const { data } = useSettlements();
  return (date: string) => !!data?.find((s) => s.month === monthKey(date))?.locked;
}

export function useSaveExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: ExpenseInput }) =>
      id ? api.updateExpense(id, input) : api.createExpense(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.expenses }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteExpense(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.expenses }),
  });
}

export function useAddCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.createCategory(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}

/** Renaming and deleting both rewrite expenses, so refresh both lists. */
function useInvalidateCategoriesAndExpenses() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: queryKeys.categories }),
      qc.invalidateQueries({ queryKey: queryKeys.expenses }),
    ]);
}

export function useRenameCategory() {
  const invalidate = useInvalidateCategoriesAndExpenses();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => api.renameCategory(id, name),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategoriesAndExpenses();
  return useMutation({
    mutationFn: ({ id, moveExpensesTo }: { id: string; moveExpensesTo?: string }) =>
      api.deleteCategory(id, moveExpensesTo),
    onSuccess: invalidate,
  });
}

export function useSaveBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (budget: Budget) => api.upsertBudget(budget),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.budgets }),
  });
}

export function useUpdateSettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ month, patch }: { month: string; patch: MonthSettlementPatch }) =>
      api.upsertSettlement(month, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.settlements }),
  });
}
