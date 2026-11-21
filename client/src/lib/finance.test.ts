import { describe, expect, it } from "vitest";

import { budgetStatus, settle, shiftMonth, spending } from "@/lib/finance";
import type { Expense } from "@/lib/types";

const e = (p: Partial<Expense>): Expense => ({
  id: Math.random().toString(),
  title: "x",
  amount: 0,
  expense_date: "2026-11-02",
  category: "Groceries",
  expense_type: "shared",
  card_owner: "dorothy",
  personal_owner: null,
  ...p,
});

describe("settlement", () => {
  it("matches the spec example: Jackie pays Dorothy $380", () => {
    const s = settle([
      e({ amount: 800, card_owner: "dorothy" }),
      e({ amount: 200, card_owner: "jackie" }),
      e({ amount: 40, expense_type: "individual", card_owner: "jackie", personal_owner: "dorothy" }),
      e({ amount: 80, expense_type: "individual", card_owner: "dorothy", personal_owner: "jackie" }),
    ]);
    expect(s.T).toBe(500);
    expect(s.D_raw).toBe(-260);
    expect(s.D_owed).toBe(0);
    expect(s.J_raw).toBe(380);
    expect(s.J_owed).toBe(380);
    expect(s.net).toBe(380);
  });

  it("is negative when Dorothy owes Jackie", () => {
    expect(settle([e({ amount: 100, card_owner: "jackie" })]).net).toBe(-50);
  });
});

describe("spending responsibility", () => {
  it("splits shared 50/50 and ignores the card owner for individual", () => {
    const s = spending([
      e({ amount: 100 }),
      e({ amount: 80, expense_type: "individual", card_owner: "jackie", personal_owner: "dorothy" }),
    ]);
    expect(s).toEqual({ household: 180, dorothy: 130, jackie: 50, shared: 100 });
  });
});

describe("budget status", () => {
  it("is yellow at 80% and red above 100%", () => {
    expect(budgetStatus(79, 100)).toBe("ok");
    expect(budgetStatus(80, 100)).toBe("warn");
    expect(budgetStatus(101, 100)).toBe("over");
  });
});

describe("shiftMonth", () => {
  it("crosses year boundaries", () => {
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
  });
});
