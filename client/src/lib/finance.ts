import { addMonths, format, parse } from "date-fns";

import type { Expense, Person } from "@/lib/types";

export const PEOPLE: Person[] = ["dorothy", "jackie"];
export const personName = (p: Person) => (p === "dorothy" ? "Dorothy" : "Jackie");

export const usd = (n: number, cents = true) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);

/** Month keys are "YYYY-MM" strings, e.g. "2026-11". */
export const monthKey = (d: Date | string) =>
  typeof d === "string" ? d.slice(0, 7) : format(d, "yyyy-MM");
export const currentMonth = () => monthKey(new Date());
const monthDate = (key: string) => parse(key + "-01", "yyyy-MM-dd", new Date());
export const monthLabel = (key: string) => format(monthDate(key), "MMMM yyyy");
export const monthShort = (key: string) => format(monthDate(key), "MMM yy");
export const shiftMonth = (key: string, n: number) => monthKey(addMonths(monthDate(key), n));

/** Parse a "YYYY-MM-DD" date as local time (not UTC). */
export const parseDay = (day: string) => new Date(day + "T00:00:00");

export const inMonth = (expenses: Expense[], key: string) =>
  expenses.filter((e) => monthKey(e.expense_date) === key);

const round = (n: number) => Math.round(n * 100) / 100;

/** Spending responsibility: 50% of shared + 100% of own individual. Card owner is irrelevant. */
export function spending(expenses: Expense[]) {
  let household = 0,
    dorothy = 0,
    jackie = 0,
    shared = 0;
  for (const e of expenses) {
    const a = Number(e.amount);
    household += a;
    if (e.expense_type === "shared") {
      shared += a;
      dorothy += a / 2;
      jackie += a / 2;
    } else if (e.personal_owner === "dorothy") dorothy += a;
    else if (e.personal_owner === "jackie") jackie += a;
  }
  return {
    household: round(household),
    dorothy: round(dorothy),
    jackie: round(jackie),
    shared: round(shared),
  };
}

export interface Settlement {
  /** Total of all shared expenses. */
  sharedTotal: number;
  /** Each person's share of shared expenses (sharedTotal / 2). */
  T: number;
  /** Shared expenses paid on Dorothy's card. */
  J_D: number;
  /** Shared expenses paid on Jackie's card. */
  J_J: number;
  /** Dorothy's personal expenses paid on Jackie's card. */
  P_DJ: number;
  /** Jackie's personal expenses paid on Dorothy's card. */
  P_JD: number;
  D_raw: number;
  J_raw: number;
  D_owed: number;
  J_owed: number;
  /** Positive: Jackie pays Dorothy. Negative: Dorothy pays Jackie. */
  net: number;
}

export function settle(expenses: Expense[]): Settlement {
  let sharedTotal = 0,
    J_D = 0,
    J_J = 0,
    P_DJ = 0,
    P_JD = 0;
  for (const e of expenses) {
    const a = Number(e.amount);
    if (e.expense_type === "shared") {
      sharedTotal += a;
      if (e.card_owner === "dorothy") J_D += a;
      else J_J += a;
    } else {
      if (e.personal_owner === "dorothy" && e.card_owner === "jackie") P_DJ += a;
      if (e.personal_owner === "jackie" && e.card_owner === "dorothy") P_JD += a;
    }
  }
  const T = sharedTotal / 2;
  const D_raw = T - J_D + P_DJ;
  const J_raw = T - J_J + P_JD;
  const D_owed = Math.max(D_raw, 0);
  const J_owed = Math.max(J_raw, 0);
  return {
    sharedTotal: round(sharedTotal),
    T: round(T),
    J_D: round(J_D),
    J_J: round(J_J),
    P_DJ: round(P_DJ),
    P_JD: round(P_JD),
    D_raw: round(D_raw),
    J_raw: round(J_raw),
    D_owed: round(D_owed),
    J_owed: round(J_owed),
    net: round(J_owed - D_owed),
  };
}

export function settlementSentence(net: number) {
  if (net > 0) return { payer: "Jackie", payee: "Dorothy", amount: net };
  if (net < 0) return { payer: "Dorothy", payee: "Jackie", amount: -net };
  return null;
}

export type BudgetStatus = "ok" | "warn" | "over";
export function budgetStatus(spent: number, budget: number): BudgetStatus {
  if (budget <= 0) return spent > 0 ? "over" : "ok";
  const pct = spent / budget;
  if (pct > 1) return "over";
  if (pct >= 0.8) return "warn";
  return "ok";
}
