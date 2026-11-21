import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { MonthPicker } from "@/components/MonthPicker";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories, useExpenses } from "@/lib/data";
import { currentMonth, inMonth, monthLabel, monthShort, shiftMonth, usd } from "@/lib/finance";

/** Categorical slots, assigned by category order (not by rank) so colors stay put. */
const SLOTS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];
const OTHER = { name: "Other", color: "var(--muted-foreground)" };

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--foreground)",
  fontSize: 13,
};

export function Analytics() {
  const { data: expenses } = useExpenses();
  const { data: categories } = useCategories();
  const [range, setRange] = useState("6");
  const [month, setMonth] = useState(currentMonth());
  const shared = useMemo(() => (expenses ?? []).filter((e) => e.expense_type === "shared"), [expenses]);

  const trend = useMemo(() => {
    const n = Number(range);
    return Array.from({ length: n }, (_, i) => shiftMonth(currentMonth(), i - n + 1)).map((m) => ({
      month: monthShort(m),
      total: Math.round(inMonth(shared, m).reduce((sum, e) => sum + e.amount, 0) * 100) / 100,
    }));
  }, [shared, range]);

  const byCategory = useMemo(() => {
    // The first six categories each own a color; any beyond that fold into "Other".
    const colorOf = new Map((categories ?? []).slice(0, SLOTS.length).map((c, i) => [c.name, SLOTS[i]]));
    const totals = new Map<string, { name: string; color: string; value: number }>();
    for (const e of inMonth(shared, month)) {
      const color = colorOf.get(e.category);
      const key = color ? e.category : OTHER.name;
      const row = totals.get(key) ?? { name: key, color: color ?? OTHER.color, value: 0 };
      row.value += e.amount;
      totals.set(key, row);
    }
    const total = [...totals.values()].reduce((sum, r) => sum + r.value, 0);
    const rows = [...totals.values()]
      .map((r) => ({ ...r, pct: total ? r.value / total : 0 }))
      .sort((a, b) => b.value - a.value);
    return { total, rows };
  }, [shared, month, categories]);

  return (
    <>
      <PageHeader title="Analytics" subtitle="Shared expenses only — individual purchases are left out." />

      <Panel>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-xl">Monthly joint spending</h2>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-40 rounded-full" aria-label="Time range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Last 6 months</SelectItem>
              <SelectItem value="9">Last 9 months</SelectItem>
              <SelectItem value="12">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-72" role="img" aria-label={`Bar chart of shared spending for the last ${range} months`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "var(--muted-foreground)" }}
                tickFormatter={(v: number) => usd(v, false)}
                width={64}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                formatter={(v) => [usd(Number(v)), "Shared spending"]}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel className="mt-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl">Joint spending by category</h2>
          <MonthPicker value={month} onChange={setMonth} />
        </div>
        {byCategory.rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No shared expenses in {monthLabel(month)}.
          </p>
        ) : (
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div className="relative h-64" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory.rows}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="90%"
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {byCategory.rows.map((r) => (
                      <Cell key={r.name} fill={r.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => usd(Number(v))} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="font-display text-2xl">{usd(byCategory.total, false)}</span>
              </div>
            </div>
            {/* Legend doubles as the data table for the chart. */}
            <ul className="grid gap-2" aria-label={`Shared spending by category, ${monthLabel(month)}`}>
              {byCategory.rows.map((r) => (
                <li key={r.name} className="flex items-center gap-3 text-sm">
                  <span className="size-3 shrink-0 rounded-full" style={{ background: r.color }} aria-hidden />
                  <span className="flex-1">{r.name}</span>
                  <span className="tabular-nums text-muted-foreground">{Math.round(r.pct * 100)}%</span>
                  <span className="w-20 text-right font-medium tabular-nums">{usd(r.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>
    </>
  );
}
