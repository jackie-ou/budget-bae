import { Route, Routes } from "react-router";

import { AppShell } from "@/components/AppShell";
import { ExpenseDialogProvider } from "@/components/ExpenseDialog";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/pages/Analytics";
import { Budgets } from "@/pages/Budgets";
import { Dashboard } from "@/pages/Dashboard";
import { Expenses } from "@/pages/Expenses";
import { NotFound } from "@/pages/NotFound";
import { Settings } from "@/pages/Settings";
import { Settlements } from "@/pages/Settlements";

export function App() {
  return (
    <ExpenseDialogProvider>
      <AppShell>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="settlements" element={<Settlements />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
      <Toaster position="top-center" />
    </ExpenseDialogProvider>
  );
}
