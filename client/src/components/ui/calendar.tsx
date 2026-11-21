import type { ComponentProps } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  const d = getDefaultClassNames();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", d.root),
        months: cn("relative flex flex-col gap-4", d.months),
        month: cn("flex flex-col gap-4", d.month),
        nav: cn("absolute inset-x-0 top-0 flex items-center justify-between", d.nav),
        button_previous: cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8", d.button_previous),
        button_next: cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8", d.button_next),
        month_caption: cn("flex h-8 items-center justify-center", d.month_caption),
        caption_label: cn("text-sm font-medium", d.caption_label),
        weekdays: cn("flex", d.weekdays),
        weekday: cn("w-9 text-[0.8rem] font-normal text-muted-foreground", d.weekday),
        week: cn("mt-1 flex w-full", d.week),
        day: cn("size-9 p-0 text-center text-sm", d.day),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 rounded-lg p-0 font-normal aria-selected:opacity-100",
          d.day_button,
        ),
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        today: "[&>button]:bg-accent [&>button]:text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />,
      }}
      {...props}
    />
  );
}

export { Calendar };
