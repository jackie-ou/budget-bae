import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Swatch = { token: string; label?: string; fg?: string }

const groups: { title: string; swatches: Swatch[] }[] = [
  {
    title: "Surfaces",
    swatches: [
      { token: "background", fg: "foreground" },
      { token: "card", fg: "card-foreground" },
      { token: "popover", fg: "popover-foreground" },
      { token: "muted", fg: "muted-foreground" },
      { token: "secondary", fg: "secondary-foreground" },
    ],
  },
  {
    title: "Brand & status",
    swatches: [
      { token: "primary", label: "primary (green)", fg: "primary-foreground" },
      { token: "accent", fg: "accent-foreground" },
      { token: "success" },
      { token: "warning" },
      { token: "danger" },
      { token: "destructive", fg: "destructive-foreground" },
    ],
  },
  {
    title: "People",
    swatches: [
      { token: "dorothy", label: "dorothy (terracotta)" },
      { token: "jackie", label: "jackie (blue)" },
    ],
  },
  {
    title: "Lines & focus",
    swatches: [{ token: "foreground" }, { token: "border" }, { token: "input" }, { token: "ring" }],
  },
  {
    title: "Charts",
    swatches: [1, 2, 3, 4, 5, 6].map((n) => ({ token: `chart-${n}` })),
  },
]

function SwatchTile({ token, label, fg }: Swatch) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex h-20 items-end rounded-xl p-2 text-xs font-medium ring-1 ring-foreground/10"
        style={{
          background: `var(--${token})`,
          color: fg ? `var(--${fg})` : undefined,
        }}
      >
        {fg ? "Aa" : null}
      </div>
      <div className="text-xs">
        <div className="font-medium">{label ?? token}</div>
        <code className="text-muted-foreground">--color-{token}</code>
      </div>
    </div>
  )
}

function Palette() {
  return (
    <div className="flex flex-col gap-8 bg-background p-6 text-foreground">
      {groups.map((g) => (
        <section key={g.title} className="flex flex-col gap-3">
          <h2 className="text-xl">{g.title}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
            {g.swatches.map((s) => (
              <SwatchTile key={s.token} {...s} />
            ))}
          </div>
        </section>
      ))}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl">Elevation & radius</h2>
        <div className="flex flex-wrap gap-4">
          {(["sm", "md", "lg", "xl", "2xl", "3xl"] as const).map((r) => (
            <div
              key={r}
              className="flex size-24 items-center justify-center bg-card text-xs shadow-soft"
              style={{ borderRadius: `var(--radius-${r})` }}
            >
              radius-{r}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const typeScale = [
  { cls: "text-4xl", label: "Display / text-4xl" },
  { cls: "text-3xl", label: "Display / text-3xl" },
  { cls: "text-2xl", label: "Display / text-2xl" },
  { cls: "text-xl", label: "Display / text-xl" },
]

function Typography() {
  return (
    <div className="flex flex-col gap-10 bg-background p-6 text-foreground">
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Headings — Fraunces (font-display)
        </p>
        {typeScale.map((t) => (
          <div key={t.cls} className="flex items-baseline gap-6">
            <code className="w-44 shrink-0 text-xs text-muted-foreground">{t.label}</code>
            <span className={`font-display ${t.cls}`}>November's Expenses</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Body — Plus Jakarta Sans (font-sans)
        </p>
        {(["text-lg", "text-base", "text-sm", "text-xs"] as const).map((cls) => (
          <div key={cls} className="flex items-baseline gap-6">
            <code className="w-44 shrink-0 text-xs text-muted-foreground">{cls}</code>
            <span className={cls}>Groceries at the farmers market, split 50/50.</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Money — <code>amount</code> (display serif + tabular-nums)
        </p>
        <div className="flex w-64 flex-col gap-1 rounded-2xl bg-card p-4 shadow-soft">
          {[1234.5, 89.99, 7.1, 11111.11].map((n) => (
            <div key={n} className="flex justify-between">
              <span className="text-sm text-muted-foreground">Item</span>
              <span className="amount text-lg">
                {n.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Components() {
  return (
    <div className="flex flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Shared groceries</CardTitle>
          <CardDescription>Nov 7 · Dorothy's card</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <span className="amount text-2xl">$84.20</span>
          <Input placeholder="Add a note" />
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="dining">Dining</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}

const meta = {
  title: "Foundations/Design Tokens",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ColorPalette: Story = { render: () => <Palette /> }
export const TypeScale: Story = { render: () => <Typography /> }
export const ShadcnComponents: Story = { render: () => <Components /> }
