import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { PersonDot } from "@/components/PersonDot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddCategory, useCategories } from "@/lib/data";
import { PEOPLE, personName } from "@/lib/finance";

export function Settings() {
  const { data: categories } = useCategories();
  const addCategory = useAddCategory();
  const [name, setName] = useState("");

  const add = () => {
    const trimmed = name.trim().slice(0, 40);
    if (!trimmed) return;
    addCategory.mutate(trimmed, {
      onSuccess: () => {
        setName("");
        toast.success("Category added");
      },
      onError: (err) => toast.error("Couldn't add category", { description: err.message }),
    });
  };

  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <h2 className="mb-3 text-xl">Household</h2>
          <ul className="grid gap-2 text-sm">
            {PEOPLE.map((p) => (
              <li key={p} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                <PersonDot person={p} /> {personName(p)}
              </li>
            ))}
          </ul>
          <h2 className="mb-2 mt-6 text-xl">Currency</h2>
          <p className="rounded-xl bg-muted px-3 py-2 text-sm">US Dollar (USD)</p>
        </Panel>
        <Panel>
          <h2 className="mb-3 text-xl">Categories</h2>
          <ul className="mb-4 flex flex-wrap gap-2">
            {(categories ?? []).map((c) => (
              <li key={c.id} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
                {c.name}
              </li>
            ))}
          </ul>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category"
              aria-label="New category name"
              maxLength={40}
            />
            <Button type="submit" disabled={!name.trim() || addCategory.isPending}>
              <Plus /> Add
            </Button>
          </form>
        </Panel>
      </div>
    </>
  );
}
