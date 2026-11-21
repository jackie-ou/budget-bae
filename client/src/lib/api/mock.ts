import type { Api } from "@/lib/api/types";
import type { Budget, Category, Expense, MonthSettlement } from "@/lib/types";
import { seedBudgets, seedCategories, seedExpenses, seedSettlements } from "@/data/dummy";

/**
 * In-memory implementation of the API, seeded with dummy data.
 * State lives for the lifetime of the page; a reload resets it.
 *
 * Delete this file (and `src/data/dummy.ts`) once the Supabase
 * implementation is in place.
 */
export function createMockApi(): Api {
  let expenses: Expense[] = seedExpenses();
  let categories: Category[] = seedCategories();
  let budgets: Budget[] = seedBudgets();
  let settlements: MonthSettlement[] = seedSettlements();

  const byNewest = (a: Expense, b: Expense) =>
    b.expense_date.localeCompare(a.expense_date) ||
    (b.created_at ?? "").localeCompare(a.created_at ?? "");

  return {
    async listExpenses() {
      return [...expenses].sort(byNewest);
    },
    async createExpense(input) {
      const row: Expense = { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() };
      expenses = [...expenses, row];
      return row;
    },
    async updateExpense(id, input) {
      const existing = expenses.find((e) => e.id === id);
      if (!existing) throw new Error("Expense not found");
      const row = { ...existing, ...input };
      expenses = expenses.map((e) => (e.id === id ? row : e));
      return row;
    },
    async deleteExpense(id) {
      expenses = expenses.filter((e) => e.id !== id);
    },

    async listCategories() {
      return [...categories].sort((a, b) => a.sort_order - b.sort_order);
    },
    async createCategory(name) {
      if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        throw new Error(`"${name}" already exists`);
      }
      const row: Category = { id: crypto.randomUUID(), name, sort_order: categories.length + 1 };
      categories = [...categories, row];
      return row;
    },
    async renameCategory(id, name) {
      const existing = categories.find((c) => c.id === id);
      if (!existing) throw new Error("Category not found");
      if (categories.some((c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
        throw new Error(`"${name}" already exists`);
      }
      const row = { ...existing, name };
      categories = categories.map((c) => (c.id === id ? row : c));
      expenses = expenses.map((e) => (e.category === existing.name ? { ...e, category: name } : e));
      return row;
    },
    async deleteCategory(id, moveExpensesTo) {
      const existing = categories.find((c) => c.id === id);
      if (!existing) throw new Error("Category not found");
      const inUse = expenses.some((e) => e.category === existing.name);
      if (inUse) {
        if (!moveExpensesTo || !categories.some((c) => c.id !== id && c.name === moveExpensesTo)) {
          throw new Error("Choose another category for its expenses");
        }
        expenses = expenses.map((e) =>
          e.category === existing.name ? { ...e, category: moveExpensesTo } : e,
        );
      }
      categories = categories.filter((c) => c.id !== id);
    },

    async listBudgets() {
      return [...budgets];
    },
    async upsertBudget(budget) {
      budgets = [
        ...budgets.filter((b) => !(b.month === budget.month && b.kind === budget.kind)),
        budget,
      ];
    },

    async listSettlements() {
      return [...settlements];
    },
    async upsertSettlement(month, patch) {
      const existing = settlements.find((s) => s.month === month) ?? {
        month,
        settled: false,
        locked: false,
        settled_at: null,
        net_transfer: null,
      };
      settlements = [...settlements.filter((s) => s.month !== month), { ...existing, ...patch }];
    },
  };
}
