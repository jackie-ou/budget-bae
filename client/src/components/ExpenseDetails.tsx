import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator";
import type { ExpenseType } from "@/types/expense"

export function ExpenseDetails({ expense }: { expense: ExpenseType }) {

  // Defines the fields and their corresponding formatting for the ExpenseType interface
  const expenseFields = [
    { key: "title", label: "Title" },
    { key: "price", label: "Price", render: (v: number) => `$${v}` },
    { key: "type", label: "Purchase Type" },
    { key: "date", label: "Date" },
    { key: "mcc", label: "Category" },
    { key: "payer", label: "Who paid" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Expense Details</CardTitle>
        <CardDescription>
          Click the "Edit" button to modify expense details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expenseFields.map(({ key, label, render }, index) => (
            <div key={key}>
              {/* Render the field names and values horizontally with spacing in-between */}
              <div className="flex justify-between py-2">
                <span className="font-medium capitalize">{label}</span>
                {/* Apply any formatting on the value defined in expenseFields */}
                <span className="flex-1 text-right ml-4 max-w-[60%] break-words">{render
                  ? render(expense[key as keyof ExpenseType])
                  : String(expense[key as keyof ExpenseType] || "-")}
                </span>
              </div>

              {/* Add separator between each expense field */}
              {index < expenseFields.length - 1 && <Separator orientation="horizontal" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card >
  )
}