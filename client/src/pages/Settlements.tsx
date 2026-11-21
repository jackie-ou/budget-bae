import { useMemo, useState, type ReactNode } from "react";
import { Calculator, CheckCircle2, Lock, LockOpen } from "lucide-react";
import { toast } from "sonner";

import { MonthPicker } from "@/components/MonthPicker";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useExpenses, useSettlements, useUpdateSettlement } from "@/lib/data";
import { currentMonth, inMonth, monthLabel, settle, settlementSentence, usd, type Settlement } from "@/lib/finance";
import type { MonthSettlementPatch } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Settlements() {
  const [month, setMonth] = useState(currentMonth());
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const { data: expenses } = useExpenses();
  const { data: settlements } = useSettlements();
  const updateSettlement = useUpdateSettlement();
  const st = useMemo(() => settle(inMonth(expenses ?? [], month)), [expenses, month]);
  const who = settlementSentence(st.net);
  const record = settlements?.find((s) => s.month === month);

  const update = (patch: MonthSettlementPatch, message: string) =>
    updateSettlement.mutate(
      { month, patch },
      {
        onSuccess: () => toast.success(message),
        onError: (err) => toast.error("Couldn't update", { description: err.message }),
      },
    );

  const outlineOnPrimary =
    "rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground";

  return (
    <>
      <PageHeader title="Settlements" subtitle="Each month is calculated fresh — nothing carries over.">
        <MonthPicker value={month} onChange={setMonth} />
      </PageHeader>

      <Panel className="border-transparent bg-primary p-8 text-center text-primary-foreground">
        <p className="text-sm opacity-80">{monthLabel(month)} net transfer</p>
        <p className="mt-2 font-display text-6xl tabular-nums md:text-7xl">{usd(who?.amount ?? 0)}</p>
        <p className="mt-3 text-lg">{who ? `${who.payer} pays ${who.payee}` : "No reimbursement needed"}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="secondary" className="rounded-full" onClick={() => setBreakdownOpen(true)}>
            <Calculator /> View settlement breakdown
          </Button>
          {record?.settled ? (
            <Button
              variant="outline"
              className={outlineOnPrimary}
              onClick={() =>
                update({ settled: false, locked: false, settled_at: null }, "Marked as unsettled")
              }
            >
              <CheckCircle2 /> Settled · undo
            </Button>
          ) : (
            <Button
              variant="outline"
              className={outlineOnPrimary}
              onClick={() =>
                update(
                  { settled: true, locked: true, settled_at: new Date().toISOString(), net_transfer: st.net },
                  `${monthLabel(month)} settled and locked`,
                )
              }
            >
              Mark as settled
            </Button>
          )}
        </div>
      </Panel>

      {record?.settled && (
        <Panel className="mt-4 flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            {record.locked ? <Lock className="size-5" /> : <LockOpen className="size-5 text-warning" />}
            <div>
              <p className="font-medium">
                {record.locked ? "Expenses locked" : "Expenses unlocked for editing"}
              </p>
              <p className="text-xs text-muted-foreground">
                Locking protects settled months from accidental edits.
              </p>
            </div>
          </div>
          <Switch
            checked={record.locked}
            onCheckedChange={(v) => update({ locked: v }, v ? "Month locked" : "Month unlocked")}
            aria-label="Lock month"
          />
        </Panel>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        <MiniStat label="Total shared expenses" value={st.sharedTotal} />
        <MiniStat label="Shared on Dorothy's card" value={st.J_D} />
        <MiniStat label="Shared on Jackie's card" value={st.J_J} />
        <MiniStat label="Dorothy's personal, paid by Jackie" value={st.P_DJ} />
        <MiniStat label="Jackie's personal, paid by Dorothy" value={st.P_JD} />
        <MiniStat label="Dorothy owes Jackie" value={st.D_owed} />
        <MiniStat label="Jackie owes Dorothy" value={st.J_owed} className="col-span-2 md:col-span-1" />
      </div>

      <Dialog open={breakdownOpen} onOpenChange={setBreakdownOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-normal">How we got here</DialogTitle>
            <DialogDescription>{monthLabel(month)} settlement, step by step.</DialogDescription>
          </DialogHeader>
          <Breakdown s={st} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function MiniStat({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <Panel className={cn("p-4", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{usd(value)}</p>
    </Panel>
  );
}

function Row({ sign, label, value, strong }: { sign?: string; label: string; value: ReactNode; strong?: boolean }) {
  const negative = typeof value === "number" && value < 0;
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1.5 text-sm",
        strong && "mt-1 border-t pt-2.5 font-semibold",
      )}
    >
      <span className="flex items-center gap-2">
        <span className="w-4 text-center font-mono text-muted-foreground" aria-hidden>
          {sign}
        </span>
        {label}
      </span>
      <span className={cn("tabular-nums", negative && "text-danger")}>
        {typeof value === "number" ? usd(value) : value}
      </span>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Step {n} · {title}
      </p>
      {children}
    </div>
  );
}

function Breakdown({ s }: { s: Settlement }) {
  const who = settlementSentence(s.net);
  return (
    <div className="grid gap-3">
      <Step n={1} title="Shared expenses">
        <Row label="Total shared expenses" value={s.sharedTotal} />
        <Row sign="÷" label="Split between two" value="2" />
        <Row sign="=" label="Each person's share (T)" value={s.T} strong />
      </Step>
      <Step n={2} title="Dorothy owes Jackie">
        <Row label="Dorothy's share (T)" value={s.T} />
        <Row sign="−" label="Shared paid on Dorothy's card" value={s.J_D} />
        <Row sign="+" label="Dorothy's personal on Jackie's card" value={s.P_DJ} />
        <Row sign="=" label="Raw result" value={s.D_raw} strong />
        <Row sign="↳" label="Can't go below zero" value={s.D_owed} strong />
      </Step>
      <Step n={3} title="Jackie owes Dorothy">
        <Row label="Jackie's share (T)" value={s.T} />
        <Row sign="−" label="Shared paid on Jackie's card" value={s.J_J} />
        <Row sign="+" label="Jackie's personal on Dorothy's card" value={s.P_JD} />
        <Row sign="=" label="Raw result" value={s.J_raw} strong />
        <Row sign="↳" label="Can't go below zero" value={s.J_owed} strong />
      </Step>
      <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
        <p className="text-xs uppercase tracking-wide opacity-80">Net transfer</p>
        <p className="text-sm opacity-90">
          {usd(s.J_owed)} − {usd(s.D_owed)} = {usd(s.net)}
        </p>
        <p className="mt-1 font-display text-2xl">
          {who ? `${who.payer} pays ${who.payee} ${usd(who.amount)}` : "You're even — no transfer needed"}
        </p>
      </div>
    </div>
  );
}
