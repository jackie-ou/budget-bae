import { Panel } from "@/components/Panel";
import { PersonDot } from "@/components/PersonDot";
import { Skeleton } from "@/components/ui/skeleton";
import { usd } from "@/lib/finance";
import type { Person } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  loading?: boolean;
  /** Filled green card, used for the headline number. */
  accent?: boolean;
  person?: Person;
  tone?: "danger";
}

export function StatCard({ label, value, loading, accent, person, tone }: StatCardProps) {
  return (
    <Panel className={cn("p-4 md:p-5", accent && "border-transparent bg-primary text-primary-foreground")}>
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs md:text-sm",
          accent ? "opacity-80" : "text-muted-foreground",
        )}
      >
        {person && <PersonDot person={person} />}
        {label}
      </p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p
          className={cn(
            "mt-1 font-display text-2xl tabular-nums md:text-3xl",
            tone === "danger" && "text-danger",
          )}
        >
          {usd(value, false)}
        </p>
      )}
    </Panel>
  );
}
