import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ExpenseType } from "@/types/expense"

export function Expense({ expense: { title, price, type, date } }: { expense: ExpenseType }) {
  return (
    <Card size="sm" className="flex flex-row justify-between">
      <CardHeader>
        <div className="flex gap-1">
          <CardTitle>{title}</CardTitle>
          <Badge>{type}</Badge>
        </div>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <span>${price}</span>
      </CardContent>
    </Card>
  )
}
