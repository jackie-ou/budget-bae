import { ExpenseDetails } from "@/components/ExpenseDetails";
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

export function Expense({ expense }: { expense: ExpenseType }) {
  const { title, amount, purchase_type, transaction_date } = expense;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card size="sm" className="flex flex-row justify-between cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-sm" role="button" tabIndex={0}>
          <CardHeader>
            <div className="flex gap-2">
              <CardTitle className="truncate">{title}</CardTitle>
              <Badge>{purchase_type}</Badge>
            </div>
            <CardDescription>{transaction_date}</CardDescription>
          </CardHeader>
          <CardContent>
            <span>${amount}</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <ExpenseDetails expense={expense}/>
      </DialogContent>
    </Dialog>
  )
}
