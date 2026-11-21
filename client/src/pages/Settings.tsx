import { CategoryManager } from "@/components/CategoryManager";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { PersonDot } from "@/components/PersonDot";
import { PEOPLE, personName } from "@/lib/finance";

export function Settings() {
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
          <CategoryManager />
        </Panel>
      </div>
    </>
  );
}
