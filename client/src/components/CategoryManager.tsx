import { useMemo, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useAddCategory,
  useCategories,
  useDeleteCategory,
  useExpenses,
  useRenameCategory,
} from "@/lib/data";
import type { Category } from "@/lib/types";

const MAX_NAME = 40;

/** Lists categories with inline rename, delete (moving expenses elsewhere) and add. */
export function CategoryManager() {
  const { data: categories = [] } = useCategories();
  const { data: expenses = [] } = useExpenses();
  const addCategory = useAddCategory();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const usage = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of expenses) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
    return counts;
  }, [expenses]);

  const add = () => {
    const name = newName.trim().slice(0, MAX_NAME);
    if (!name) return;
    addCategory.mutate(name, {
      onSuccess: () => {
        setNewName("");
        toast.success("Category added");
      },
      onError: (err) => toast.error("Couldn't add category", { description: err.message }),
    });
  };

  return (
    <>
      <ul className="mb-4 grid gap-1">
        {categories.map((c) => {
          const count = usage.get(c.name) ?? 0;
          return editingId === c.id ? (
            <RenameRow key={c.id} category={c} onDone={() => setEditingId(null)} />
          ) : (
            <li
              key={c.id}
              className="group flex items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-muted/60"
            >
              <span className="flex-1 truncate text-sm">{c.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {count} {count === 1 ? "expense" : "expenses"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                aria-label={`Rename ${c.name}`}
                onClick={() => setEditingId(c.id)}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-destructive hover:text-destructive"
                aria-label={`Delete ${c.name}`}
                title={categories.length === 1 ? "Keep at least one category" : undefined}
                disabled={categories.length === 1}
                onClick={() => setDeleting(c)}
              >
                <Trash2 />
              </Button>
            </li>
          );
        })}
      </ul>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category"
          aria-label="New category name"
          maxLength={MAX_NAME}
        />
        <Button type="submit" disabled={!newName.trim() || addCategory.isPending}>
          <Plus /> Add
        </Button>
      </form>

      <DeleteCategoryDialog
        category={deleting}
        expenseCount={deleting ? (usage.get(deleting.name) ?? 0) : 0}
        others={categories.filter((c) => c.id !== deleting?.id)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

function RenameRow({ category, onDone }: { category: Category; onDone: () => void }) {
  const renameCategory = useRenameCategory();
  const [name, setName] = useState(category.name);
  const trimmed = name.trim().slice(0, MAX_NAME);

  const save = () => {
    if (!trimmed || trimmed === category.name) return onDone();
    renameCategory.mutate(
      { id: category.id, name: trimmed },
      {
        onSuccess: () => {
          toast.success(`Renamed to "${trimmed}"`);
          onDone();
        },
        onError: (err) => toast.error("Couldn't rename", { description: err.message }),
      },
    );
  };

  return (
    <li>
      <form
        className="flex items-center gap-2 px-1 py-0.5"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onDone()}
          aria-label={`New name for ${category.name}`}
          maxLength={MAX_NAME}
          className="h-8"
        />
        <Button
          type="submit"
          size="icon"
          className="size-8 shrink-0 rounded-full"
          aria-label="Save name"
          disabled={!trimmed || renameCategory.isPending}
        >
          <Check />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-full"
          aria-label="Cancel rename"
          onClick={onDone}
        >
          <X />
        </Button>
      </form>
    </li>
  );
}

interface DeleteCategoryDialogProps {
  category: Category | null;
  expenseCount: number;
  /** Categories the expenses can be moved to. */
  others: Category[];
  onClose: () => void;
}

function DeleteCategoryDialog({ category, expenseCount, others, onClose }: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategory();
  const [moveTo, setMoveTo] = useState("");
  const needsMove = expenseCount > 0;

  const close = () => {
    setMoveTo("");
    onClose();
  };

  const remove = () => {
    if (!category) return;
    deleteCategory.mutate(
      { id: category.id, moveExpensesTo: needsMove ? moveTo : undefined },
      {
        onSuccess: () =>
          toast.success(
            needsMove ? `Deleted "${category.name}" and moved its expenses to ${moveTo}` : `Deleted "${category.name}"`,
          ),
        onError: (err) => toast.error("Couldn't delete", { description: err.message }),
      },
    );
    close();
  };

  return (
    <AlertDialog open={!!category} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{category?.name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            {needsMove
              ? `${expenseCount} ${expenseCount === 1 ? "expense uses" : "expenses use"} this category. Choose where to move ${expenseCount === 1 ? "it" : "them"}.`
              : "No expenses use this category."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {needsMove && (
          <div className="grid gap-1.5">
            <Label htmlFor="move-expenses-to">Move expenses to</Label>
            <Select value={moveTo} onValueChange={setMoveTo}>
              <SelectTrigger id="move-expenses-to">
                <SelectValue placeholder="Choose a category…" />
              </SelectTrigger>
              <SelectContent>
                {others.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction
            onClick={remove}
            disabled={needsMove && !moveTo}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
