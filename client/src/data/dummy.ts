/**
 * DUMMY DATA — temporary stand-in until Supabase is wired up.
 *
 * Mirrors the seed in the Lovable design project. Dates are generated
 * relative to the current month so the dashboard always has something
 * to show. Only `src/lib/api/mock.ts` imports this file; delete both
 * when switching to Supabase.
 */
import { format, setDate, subMonths } from "date-fns";

import { monthKey } from "@/lib/finance";
import type { Budget, Category, Expense, ExpenseType, MonthSettlement, Person } from "@/lib/types";

const CATEGORY_NAMES = [
  "Groceries",
  "Utilities & Bills",
  "Dining Out",
  "Home & Supplies",
  "Entertainment",
  "Transportation",
];

type Row = [
  title: string,
  amount: number,
  day: number,
  category: string,
  type: ExpenseType,
  card: Person,
  owner: Person | null,
];

/**
 * Current month. Settles to "Jackie pays Dorothy $380":
 * shared $1,000 (Dorothy's card $800 / Jackie's card $200),
 * Dorothy's personal on Jackie's card $40, Jackie's personal on Dorothy's card $80.
 */
const CURRENT_MONTH: Row[] = [
  ["Costco groceries", 100, 2, "Groceries", "shared", "dorothy", null],
  ["Electric bill", 180, 3, "Utilities & Bills", "shared", "dorothy", null],
  ["Trader Joe's run", 145, 4, "Groceries", "shared", "dorothy", null],
  ["Internet & streaming", 125, 5, "Utilities & Bills", "shared", "dorothy", null],
  ["Date night at Osteria", 150, 5, "Dining Out", "shared", "dorothy", null],
  ["Target home restock", 100, 6, "Home & Supplies", "shared", "dorothy", null],
  ["Gas", 60, 3, "Transportation", "shared", "jackie", null],
  ["Concert tickets", 90, 4, "Entertainment", "shared", "jackie", null],
  ["Thai takeout", 50, 6, "Dining Out", "shared", "jackie", null],
  ["Book club novel", 40, 4, "Entertainment", "individual", "jackie", "dorothy"],
  ["Video game", 50, 2, "Entertainment", "individual", "dorothy", "jackie"],
  ["Car wash", 30, 5, "Transportation", "individual", "dorothy", "jackie"],
  ["Sephora", 80, 3, "Home & Supplies", "individual", "dorothy", "dorothy"],
  ["Gym class pack", 65, 6, "Entertainment", "individual", "jackie", "jackie"],
];

/** Repeated for each of the previous five months, scaled up 7% per month back. */
const PAST_MONTH: Row[] = [
  ["Costco groceries", 210, 3, "Groceries", "shared", "dorothy", null],
  ["Whole Foods", 95, 13, "Groceries", "shared", "jackie", null],
  ["Electric bill", 160, 6, "Utilities & Bills", "shared", "dorothy", null],
  ["Water & trash", 70, 9, "Utilities & Bills", "shared", "jackie", null],
  ["Brunch with friends", 88, 15, "Dining Out", "shared", "jackie", null],
  ["Pizza night", 42, 21, "Dining Out", "shared", "dorothy", null],
  ["Cleaning supplies", 55, 11, "Home & Supplies", "shared", "dorothy", null],
  ["Movie night", 36, 19, "Entertainment", "shared", "jackie", null],
  ["Gas", 62, 7, "Transportation", "shared", "jackie", null],
  ["Gas", 58, 23, "Transportation", "shared", "dorothy", null],
  ["Sephora", 80, 10, "Home & Supplies", "individual", "jackie", "dorothy"],
  ["Video game", 50, 16, "Entertainment", "individual", "dorothy", "jackie"],
  ["Haircut", 45, 18, "Home & Supplies", "individual", "dorothy", "dorothy"],
  ["Running shoes", 110, 25, "Entertainment", "individual", "jackie", "jackie"],
];

const monthsAgo = (n: number) => subMonths(new Date(), n);

function toExpenses(rows: Row[], monthsBack: number, scale = 1): Expense[] {
  const month = monthsAgo(monthsBack);
  return rows.map(([title, amount, day, category, expense_type, card_owner, personal_owner], i) => ({
    id: `dummy-${monthsBack}-${i}`,
    title,
    amount: Math.round(amount * scale * 100) / 100,
    expense_date: format(setDate(month, day), "yyyy-MM-dd"),
    category,
    expense_type,
    card_owner,
    personal_owner,
    created_at: setDate(month, day).toISOString(),
  }));
}

export function seedExpenses(): Expense[] {
  const past = [1, 2, 3, 4, 5].flatMap((m) => toExpenses(PAST_MONTH, m, 1 + m * 0.07));
  return [...toExpenses(CURRENT_MONTH, 0), ...past];
}

export function seedCategories(): Category[] {
  return CATEGORY_NAMES.map((name, i) => ({ id: `dummy-cat-${i}`, name, sort_order: i + 1 }));
}

export function seedBudgets(): Budget[] {
  return [0, 1, 2, 3, 4, 5].flatMap((m) => {
    const month = monthKey(monthsAgo(m));
    return [
      { month, kind: "household", amount: 1600 },
      { month, kind: "dorothy", amount: 900 },
      { month, kind: "jackie", amount: 900 },
    ] satisfies Budget[];
  });
}

/** Months 2–5 back are settled and locked; last month and this month are open. */
export function seedSettlements(): MonthSettlement[] {
  return [2, 3, 4, 5].map((m) => ({
    month: monthKey(monthsAgo(m)),
    settled: true,
    locked: true,
    settled_at: monthsAgo(m - 1).toISOString(),
    net_transfer: null,
  }));
}
