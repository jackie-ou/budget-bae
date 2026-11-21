import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { currentMonth, monthLabel, shiftMonth } from "@/lib/finance";

interface MonthPickerProps {
  /** "YYYY-MM" */
  value: string;
  onChange: (month: string) => void;
}

/** Steps through months; can't go past the current month. */
export function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <div className="inline-flex items-center gap-1 self-start rounded-full border bg-card p-1 shadow-soft sm:self-auto">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-full"
        onClick={() => onChange(shiftMonth(value, -1))}
        aria-label="Previous month"
      >
        <ChevronLeft />
      </Button>
      <span className="min-w-32 text-center text-sm font-medium" aria-live="polite">
        {monthLabel(value)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-full"
        disabled={value >= currentMonth()}
        onClick={() => onChange(shiftMonth(value, 1))}
        aria-label="Next month"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
