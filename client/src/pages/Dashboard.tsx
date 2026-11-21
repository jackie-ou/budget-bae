import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, CheckCircle2, Circle, Plus } from "lucide-react";

import { BudgetBar } from "@/components/BudgetBar";
import { useExpenseDialog } from "@/components/ExpenseDialogContext";
import { ExpenseRow } from "@/components/ExpenseRow";
import { MonthPicker } from "@/components/MonthPicker";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { PersonDot } from "@/components/PersonDot";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { budgetsFor, useBudgets, useExpenses, useIsLocked, useSettlements } from "@/lib/data";
import {
  currentMonth,
  inMonth,
  monthLabel,
  settle,
  settlementSentence,
  spending,
  usd,
} from "@/lib/finance";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const [month, setMonth] = useState(currentMonth());
  const { data: expenses, isLoading } = useExpenses();
  const { data: budgets } = useBudgets();
  const { data: settlements } = useSettlements();
  const { openNew, openEdit } = useExpenseDialog();
  const isLocked = useIsLocked();

  const monthExpenses = useMemo(() => inMonth(expenses ?? [], month), [expenses, month]);
  const spent = spending(monthExpenses);
  const budget = budgetsFor(budgets, month);
  const who = settlementSentence(settle(monthExpenses).net);
  const settled = settlements?.find((s) => s.month === month)?.settled;
  const householdLeft = budget.household - spent.household;

  return (
    <>
      <PageHeader title="Hi, Dorothy & Jackie" subtitle={`Here's how ${monthLabel(month)} is shaping up.`}>
        <MonthPicker value={month} onChange={setMonth} />
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Household spending" value={spent.household} loading={isLoading} accent />
        <StatCard label="Dorothy's share" value={spent.dorothy} loading={isLoading} person="dorothy" />
        <StatCard label="Jackie's share" value={spent.jackie} loading={isLoading} person="jackie" />
        <StatCard
          label="Household budget left"
          value={householdLeft}
          loading={isLoading}
          tone={householdLeft < 0 ? "danger" : undefined}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">Budgets</h2>
            <Link to="/budgets" className="text-sm text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="grid gap-5">
            <BudgetBar label="Household" spent={spent.household} budget={budget.household} />
            <BudgetBar
              label={
                <span className="inline-flex items-center gap-1.5">
                  <PersonDot person="dorothy" />
                  Dorothy
                </span>
              }
              spent={spent.dorothy}
              budget={budget.dorothy}
            />
            <BudgetBar
              label={
                <span className="inline-flex items-center gap-1.5">
                  <PersonDot person="jackie" />
                  Jackie
                </span>
              }
              spent={spent.jackie}
              budget={budget.jackie}
            />
          </div>
        </Panel>

        <Panel className="flex flex-col bg-accent/50 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Settlement</h2>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                settled ? "bg-success/20" : "bg-card",
              )}
            >
              {settled ? <CheckCircle2 className="size-3.5" /> : <Circle className="size-3.5" />}
              {settled ? "Settled" : "Unsettled"}
            </span>
          </div>
          <div className="my-6 flex-1">
            {isLoading ? (
              <Skeleton className="h-12 w-40" />
            ) : (
              <>
                <p className="font-display text-5xl tabular-nums">{usd(who?.amount ?? 0)}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {who ? `${who.payer} pays ${who.payee}` : "You're even — nothing to transfer."}
                </p>
              </>
            )}
          </div>
          <Button asChild variant="outline" className="rounded-full bg-card">
            <Link to="/settlements">
              See the breakdown <ArrowRight />
            </Link>
          </Button>
        </Panel>
      </div>

      <Panel className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl">Recent expenses</h2>
          <div className="flex items-center gap-2">
            <Link to="/expenses" className="text-sm text-primary hover:underline">
              View all
            </Link>
            <Button size="sm" className="rounded-full" onClick={openNew}>
              <Plus /> Add
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="grid gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 rounded-2xl" />
            ))}
          </div>
        ) : monthExpenses.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No expenses in {monthLabel(month)} yet.
          </p>
        ) : (
          <div className="-mx-3 divide-y divide-border/60">
            {monthExpenses.slice(0, 6).map((e) => (
              <ExpenseRow key={e.id} expense={e} onClick={() => openEdit(e)} locked={isLocked(e.expense_date)} />
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
