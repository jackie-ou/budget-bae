import { AddExpenseForm } from "@/components/AddExpenseForm";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ExpenseType } from "@/types/expense"

export function Expense({ expense: { title, price, type, date } }: { expense: ExpenseType }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card size="sm" className="flex flex-row justify-between cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-sm" role="button" tabIndex={0}>
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
      </DialogTrigger>
      <DialogContent>
        <AddExpenseForm />
      </DialogContent>
    </Dialog>
  )
}
