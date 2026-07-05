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
                    variant="outline"
                    className="justify-start font-normal"
                >
                    {/* TODO: add plus button on the left of the text */}
                    Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent>
                {/* FIXME: don't let form span entire page (set height) */}
                <AddExpenseForm />
            </DialogContent>
        </Dialog>
    )


}

