import { Apple } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Controller, useForm } from "react-hook-form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export function AddExpenseForm() {
  const form = useForm({
    defaultValues: {
      payer: "you",
      amount: "",
      type: "joint",
      description: "",
      datePicker: new Date(),
      category: "",
    },
  })

  function onSubmit(data) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
        <CardDescription>
          Add a purchase and choose who paid and how it should be split.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="payer"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-payer">
                    Who Paid
                  </FieldLabel>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="max-w-sm">
                    <FieldLabel htmlFor="you">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>You</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="you" id="you" />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="spouse">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Spouse</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="spouse" id="spouse" />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-amount">
                    Amount
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-amount"
                    aria-invalid={fieldState.invalid}
                    placeholder="$0.00"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-type">
                    Type
                  </FieldLabel>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="max-w-sm">
                    <FieldLabel htmlFor="joint">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Joint</FieldTitle>
                          <FieldDescription>
                            Use for shared costs like rent, groceries, or dining out together.
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="joint" id="joint" />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="individual">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Individual</FieldTitle>
                          <FieldDescription>
                            Use for personal purchases like hobbies, clothes, or gifts.
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="individual" id="individual" />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="datePicker"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="justify-start font-normal"
                        aria-invalid={fieldState.invalid}
                      >
                        {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          field.onBlur()
                        }}
                        defaultMonth={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}>
            </Controller>
            <Controller
              name="category"
              control={form.control}
              render={() => (
                <Field>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Category
                  </FieldLabel>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Purchase categories</SelectLabel>
                        <SelectItem value="dining">Dining</SelectItem>
                        <SelectItem value="gas">Gas</SelectItem>
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="test">
                          <div className="flex items-center">
                            <Apple className="mr-1" />
                            test
                          </div></SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}>
            </Controller>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Notes (optional)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="Description or merchant name..."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-end">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card >
  )
}