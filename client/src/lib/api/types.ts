import type {
  Budget,
  Category,
  Expense,
  ExpenseInput,
  MonthSettlement,
  MonthSettlementPatch,
} from "@/lib/types";

/**
 * Everything the UI needs from the backend. The app talks only to this
 * interface (through the hooks in `@/lib/data`), so swapping the mock for
 * Supabase means writing one new implementation and changing `./index.ts`.
 */
export interface Api {
  listExpenses(): Promise<Expense[]>;
  createExpense(input: ExpenseInput): Promise<Expense>;
  updateExpense(id: string, input: ExpenseInput): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;

  listCategories(): Promise<Category[]>;
  createCategory(name: string): Promise<Category>;

  listBudgets(): Promise<Budget[]>;
  upsertBudget(budget: Budget): Promise<void>;

  listSettlements(): Promise<MonthSettlement[]>;
  upsertSettlement(month: string, patch: MonthSettlementPatch): Promise<void>;
}
