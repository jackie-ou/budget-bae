import { useMemo, useState } from "react";
import { toast } from "sonner";

import { BudgetBar } from "@/components/BudgetBar";
import { MonthPicker } from "@/components/MonthPicker";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { PersonDot } from "@/components/PersonDot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { budgetsFor, useBudgets, useExpenses, useSaveBudget } from "@/lib/data";
import { currentMonth, inMonth, monthLabel, spending } from "@/lib/finance";
import type { BudgetKind } from "@/lib/types";

const KINDS: { kind: BudgetKind; label: string }[] = [
  { kind: "household", label: "Household" },
  { kind: "dorothy", label: "Dorothy" },
  { kind: "jackie", label: "Jackie" },
];

export function Budgets() {
  const [month, setMonth] = useState(currentMonth());
  const { data: expenses } = useExpenses();
  const { data: budgets } = useBudgets();
  const saveBudget = useSaveBudget();
  const spent = useMemo(() => spending(inMonth(expenses ?? [], month)), [expenses, month]);
  const budget = budgetsFor(budgets, month);
  const [draft, setDraft] = useState<Partial<Record<BudgetKind, string>>>({});

  const save = (kind: BudgetKind) => {
    const amount = Number(draft[kind]);
    if (isNaN(amount) || amount < 0) {
      toast.error("Enter a valid amount");
      return;
    }
    saveBudget.mutate(
      { month, kind, amount },
      {
        onSuccess: () => {
          setDraft((d) => ({ ...d, [kind]: "" }));
          toast.success(`Budget updated for ${monthLabel(month)}`);
        },
        onError: (err) => toast.error("Couldn't save", { description: err.message }),
      },
    );
  };

  return (
    <>
      <PageHeader title="Budgets" subtitle="Personal spending includes each person's half of shared costs.">
        <MonthPicker value={month} onChange={setMonth} />
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-3">
        {KINDS.map(({ kind, label }) => (
          <Panel key={kind}>
            <BudgetBar
              label={
                <span className="inline-flex items-center gap-1.5 font-display text-lg">
                  {kind !== "household" && <PersonDot person={kind} />}
                  {label}
                </span>
              }
              spent={spent[kind]}
              budget={budget[kind]}
            />
            <form
              className="mt-5 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                save(kind);
              }}
            >
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  min="0"
                  className="pl-7"
                  aria-label={`${label} budget for ${monthLabel(month)}`}
                  placeholder={String(budget[kind])}
                  value={draft[kind] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [kind]: e.target.value }))}
                />
              </div>
              <Button type="submit" variant="secondary" disabled={!draft[kind]}>
                Save
              </Button>
            </form>
          </Panel>
        ))}
      </div>
    </>
  );
}
