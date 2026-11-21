import { useMemo, useState, type ReactNode } from "react";
import { format } from "date-fns";
import { CalendarIcon, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ExpenseDialogContext, type ExpenseDialogApi } from "@/components/ExpenseDialogContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCategories, useDeleteExpense, useIsLocked, useSaveExpense } from "@/lib/data";
import { monthKey, monthLabel, parseDay } from "@/lib/finance";
import type { Expense, ExpenseType, Person } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Renders the add/edit expense dialog once and exposes it via `useExpenseDialog()`. */
export function ExpenseDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const value = useMemo<ExpenseDialogApi>(
    () => ({
      openNew: () => {
        setEditing(null);
        setOpen(true);
      },
      openEdit: (e) => {
        setEditing(e);
        setOpen(true);
      },
    }),
    [],
  );

  return (
    <ExpenseDialogContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <ExpenseForm key={editing?.id ?? "new"} expense={editing} onDone={() => setOpen(false)} />
        )}
      </Dialog>
    </ExpenseDialogContext.Provider>
  );
}

export function ExpenseForm({ expense, onDone }: { expense: Expense | null; onDone: () => void }) {
  const { data: categories } = useCategories();
  const isLocked = useIsLocked();
  const saveExpense = useSaveExpense();
  const deleteExpense = useDeleteExpense();

  const [title, setTitle] = useState(expense?.title ?? "");
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [date, setDate] = useState<Date>(expense ? parseDay(expense.expense_date) : new Date());
  const [dateOpen, setDateOpen] = useState(false);
  const [category, setCategory] = useState(expense?.category ?? "Groceries");
  const [type, setType] = useState<ExpenseType>(expense?.expense_type ?? "shared");
  const [card, setCard] = useState<Person>(expense?.card_owner ?? "dorothy");
  const [owner, setOwner] = useState<Person | "">(expense?.personal_owner ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dateStr = format(date, "yyyy-MM-dd");
  const lockedOriginal = expense ? isLocked(expense.expense_date) : false;
  const locked = lockedOriginal || isLocked(dateStr);
  const lockedMonth = monthKey(lockedOriginal && expense ? expense.expense_date : dateStr);

  const save = () => {
    const errs: Record<string, string> = {};
    const amt = Number(amount);
    if (!title.trim()) errs.title = "Give it a name";
    if (!amount || isNaN(amt) || amt <= 0) errs.amount = "Enter an amount above $0";
    if (type === "individual" && !owner) errs.owner = "Choose whose expense this is";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    saveExpense.mutate(
      {
        id: expense?.id,
        input: {
          title: title.trim().slice(0, 120),
          amount: Math.round(amt * 100) / 100,
          expense_date: dateStr,
          category,
          expense_type: type,
          card_owner: card,
          personal_owner: type === "individual" ? (owner as Person) : null,
        },
      },
      {
        onSuccess: () => {
          toast.success(expense ? "Expense updated" : "Expense added");
          onDone();
        },
        onError: (err) => toast.error("Couldn't save expense", { description: err.message }),
      },
    );
  };

  const remove = () => {
    if (!expense) return;
    deleteExpense.mutate(expense.id, {
      onSuccess: () => {
        toast.success("Expense deleted");
        onDone();
      },
      onError: (err) => toast.error("Couldn't delete", { description: err.message }),
    });
  };

  return (
    <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-display text-2xl font-normal">
          {expense ? "Edit expense" : "Add expense"}
        </DialogTitle>
        <DialogDescription>
          Shared costs split 50/50. Individual costs belong to one person.
        </DialogDescription>
      </DialogHeader>

      {locked && (
        <div className="flex items-start gap-2 rounded-2xl bg-warning/15 p-3 text-sm">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <span>
            {monthLabel(lockedMonth)} is settled and locked. Unlock it on the Settlements page to make
            changes.
          </span>
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="expense-title">Title</Label>
          <Input
            id="expense-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Costco groceries"
            maxLength={120}
            aria-invalid={!!errors.title}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="expense-amount">Amount</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="expense-amount"
                inputMode="decimal"
                type="number"
                step="0.01"
                min="0"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                aria-invalid={!!errors.amount}
              />
            </div>
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="expense-date">Date</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button id="expense-date" variant="outline" className="justify-start font-normal">
                  <CalendarIcon />
                  {format(date, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  defaultMonth={date}
                  onSelect={(d) => {
                    if (d) setDate(d);
                    setDateOpen(false);
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="expense-category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="expense-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(categories ?? []).map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label id="expense-type-label">Expense type</Label>
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(v) => v && setType(v as ExpenseType)}
            className="grid grid-cols-2 gap-2"
            aria-labelledby="expense-type-label"
          >
            <ToggleGroupItem
              value="shared"
              className="rounded-xl border data-[state=on]:border-primary data-[state=on]:bg-accent"
            >
              Shared
            </ToggleGroupItem>
            <ToggleGroupItem
              value="individual"
              className="rounded-xl border data-[state=on]:border-primary data-[state=on]:bg-accent"
            >
              Individual
            </ToggleGroupItem>
          </ToggleGroup>
          {type === "shared" && (
            <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
              Automatically split 50/50 between Dorothy and Jackie.
            </p>
          )}
        </div>

        <div className={cn("grid gap-3", type === "individual" && "grid-cols-2")}>
          <div className="grid gap-1.5">
            <Label htmlFor="expense-card">Card used</Label>
            <Select value={card} onValueChange={(v) => setCard(v as Person)}>
              <SelectTrigger id="expense-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dorothy">Dorothy's card</SelectItem>
                <SelectItem value="jackie">Jackie's card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === "individual" && (
            <div className="grid gap-1.5">
              <Label htmlFor="expense-owner">Whose expense?</Label>
              <Select value={owner} onValueChange={(v) => setOwner(v as Person)}>
                <SelectTrigger id="expense-owner" aria-invalid={!!errors.owner}>
                  <SelectValue placeholder="Choose…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dorothy">Dorothy</SelectItem>
                  <SelectItem value="jackie">Jackie</SelectItem>
                </SelectContent>
              </Select>
              {errors.owner && <p className="text-xs text-destructive">{errors.owner}</p>}
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="flex-row items-center gap-2 sm:justify-between">
        {expense ? (
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            disabled={locked}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 /> Delete
          </Button>
        ) : (
          <span />
        )}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={onDone}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saveExpense.isPending || locked}>
            {saveExpense.isPending ? "Saving…" : expense ? "Save changes" : "Add expense"}
          </Button>
        </div>
      </DialogFooter>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{expense?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes it for both of you and can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={remove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContent>
  );
}
