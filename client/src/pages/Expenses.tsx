import { useMemo, useState } from "react";
import { ArrowDownUp, Plus, Search } from "lucide-react";

import { useExpenseDialog } from "@/components/ExpenseDialogContext";
import { ExpenseRow } from "@/components/ExpenseRow";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useExpenses, useIsLocked } from "@/lib/data";
import { currentMonth, monthKey, monthLabel, usd } from "@/lib/finance";

type Sort = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export function Expenses() {
  const { data: expenses, isLoading } = useExpenses();
  const { data: categories } = useCategories();
  const { openNew, openEdit } = useExpenseDialog();
  const isLocked = useIsLocked();
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState(currentMonth());
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [card, setCard] = useState("all");
  const [sort, setSort] = useState<Sort>("date-desc");

  const months = useMemo(() => {
    const set = new Set((expenses ?? []).map((e) => monthKey(e.expense_date)));
    set.add(currentMonth());
    return [...set].sort().reverse();
  }, [expenses]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = (expenses ?? []).filter(
      (e) =>
        (month === "all" || monthKey(e.expense_date) === month) &&
        (category === "all" || e.category === category) &&
        (type === "all" || e.expense_type === type) &&
        (card === "all" || e.card_owner === card) &&
        (!term || e.title.toLowerCase().includes(term)),
    );
    const [key, dir] = sort.split("-");
    return list.sort((a, b) => {
      const d = key === "date" ? a.expense_date.localeCompare(b.expense_date) : a.amount - b.amount;
      return dir === "asc" ? d : -d;
    });
  }, [expenses, query, month, category, type, card, sort]);

  const total = rows.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <PageHeader title="Expenses" subtitle={`${rows.length} ${rows.length === 1 ? "expense" : "expenses"} · ${usd(total)}`}>
        <Button className="self-start rounded-full sm:self-auto" onClick={openNew}>
          <Plus /> Add expense
        </Button>
      </PageHeader>

      <Panel className="mb-4 p-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title"
            aria-label="Search expenses by title"
            className="rounded-full pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="rounded-full" aria-label="Month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {monthLabel(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-full" aria-label="Category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(categories ?? []).map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="rounded-full" aria-label="Expense type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Shared & individual</SelectItem>
              <SelectItem value="shared">Shared only</SelectItem>
              <SelectItem value="individual">Individual only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={card} onValueChange={setCard}>
            <SelectTrigger className="rounded-full" aria-label="Card used">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any card</SelectItem>
              <SelectItem value="dorothy">Dorothy's card</SelectItem>
              <SelectItem value="jackie">Jackie's card</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="col-span-2 rounded-full md:col-span-1" aria-label="Sort">
              <ArrowDownUp className="size-3.5 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest first</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
              <SelectItem value="amount-desc">Highest amount</SelectItem>
              <SelectItem value="amount-asc">Lowest amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Panel>

      <Panel className="p-2 md:p-3">
        {isLoading ? (
          <div className="grid gap-2 p-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-2xl" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No expenses match these filters.</p>
        ) : (
          <div className="divide-y divide-border/60">
            {rows.map((e) => (
              <ExpenseRow key={e.id} expense={e} onClick={() => openEdit(e)} locked={isLocked(e.expense_date)} />
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
