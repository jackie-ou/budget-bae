import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AddExpenseForm } from "./AddExpenseForm";

export function AddExpenseButton() {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="justify-start font-normal px-5 py-5 rounded-full shadow-lg"
                >
                    <div className="flex items-center gap-2">
                        <Plus className="mr-1" />
                        <p>Add Expense</p>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                {/* FIXME: don't let form span entire page (set height) */}
                <AddExpenseForm />
            </DialogContent>
        </Dialog>
    )


}

