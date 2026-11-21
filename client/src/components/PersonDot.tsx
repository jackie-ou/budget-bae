import { cn } from "@/lib/utils";
import type { Person } from "@/lib/types";

/** Small colored dot identifying Dorothy (terracotta) or Jackie (blue). */
export function PersonDot({ person, className }: { person: Person; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        person === "dorothy" ? "bg-dorothy" : "bg-jackie",
        className,
      )}
    />
  );
}
