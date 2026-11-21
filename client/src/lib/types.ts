/**
 * Domain types. Field names match the planned Supabase tables
 * (expenses, categories, budgets, month_settlements) so rows can be
 * used directly once the API layer is backed by Supabase.
 */

export type Person = "dorothy" | "jackie";
export type ExpenseType = "shared" | "individual";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  /** "YYYY-MM-DD" */
  expense_date: string;
  category: string;
  expense_type: ExpenseType;
  card_owner: Person;
  /** Set only for individual expenses. */
  personal_owner: Person | null;
  created_at?: string;
}

export type ExpenseInput = Omit<Expense, "id" | "created_at">;

export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

export type BudgetKind = "household" | Person;

export interface Budget {
  /** "YYYY-MM" */
  month: string;
  kind: BudgetKind;
  amount: number;
}

export interface MonthSettlement {
  /** "YYYY-MM" */
  month: string;
  settled: boolean;
  locked: boolean;
  settled_at: string | null;
  net_transfer: number | null;
}

export type MonthSettlementPatch = Partial<Omit<MonthSettlement, "month">>;
