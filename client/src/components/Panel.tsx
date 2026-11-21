import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** The rounded card surface used for every block on a page. */
export function Panel({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-3xl border bg-card p-5 shadow-soft", className)} {...props} />;
}
