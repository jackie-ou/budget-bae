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
  /** Renames a category and every expense filed under its old name. */
  renameCategory(id: string, name: string): Promise<Category>;
  /**
   * Deletes a category. If expenses still use it, `moveExpensesTo` (another
   * category's name) is required and those expenses are moved there.
   */
  deleteCategory(id: string, moveExpensesTo?: string): Promise<void>;

  listBudgets(): Promise<Budget[]>;
  upsertBudget(budget: Budget): Promise<void>;

  listSettlements(): Promise<MonthSettlement[]>;
  upsertSettlement(month: string, patch: MonthSettlementPatch): Promise<void>;
}
