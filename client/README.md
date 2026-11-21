# Budget Bae client

React + TypeScript + Vite + Tailwind v4, with Radix-based UI primitives in the shadcn style. The UI follows the Lovable design project.

## Layout

| Path | What lives there |
| --- | --- |
| `src/pages/` | One component per route (Dashboard, Expenses, Budgets, Settlements, Analytics, Settings) |
| `src/components/` | App components (AppShell, ExpenseDialog, ExpenseRow, BudgetBar, …) |
| `src/components/ui/` | Low-level primitives (button, dialog, select, …) |
| `src/lib/finance.ts` | Pure money logic: spending split, settlement math, budget status |
| `src/lib/data.ts` | React Query hooks. Components get and change data only through these |
| `src/lib/api/` | The backend interface (`types.ts`) and the active implementation (`index.ts`) |

## Dummy data

The app currently runs on an in-memory mock backend (`src/lib/api/mock.ts`), seeded by `src/data/dummy.ts`. Changes last until you reload the page.

To switch to Supabase, implement the `Api` interface in `src/lib/api/types.ts` (for example in `src/lib/api/supabase.ts`), export it from `src/lib/api/index.ts`, then delete `mock.ts` and `src/data/dummy.ts`. Nothing else needs to change.
