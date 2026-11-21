import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router";
import {
  BarChart3,
  Handshake,
  LayoutDashboard,
  PanelLeft,
  PiggyBank,
  Plus,
  Receipt,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { useExpenseDialog } from "@/components/ExpenseDialogContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "Expenses", to: "/expenses", icon: Receipt },
  { title: "Budgets", to: "/budgets", icon: PiggyBank },
  { title: "Settlements", to: "/settlements", icon: Handshake },
  { title: "Analytics", to: "/analytics", icon: BarChart3 },
];
const SETTINGS: NavItem = { title: "Settings", to: "/settings", icon: Settings };

function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-lg text-primary-foreground">
        B
      </span>
      {!collapsed && <span className="font-display text-xl">Budget Bae</span>}
    </Link>
  );
}

function SidebarLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      title={collapsed ? item.title : undefined}
      className={({ isActive }) =>
        cn(
          "flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
          collapsed && "justify-center px-0",
        )
      }
    >
      <item.icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </NavLink>
  );
}

function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className={cn("px-3 py-5", collapsed && "flex justify-center px-0")}>
        <Logo collapsed={collapsed} />
      </div>
      <nav aria-label="Main" className="flex flex-1 flex-col gap-1 p-2">
        {NAV.map((item) => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>
      <div className="p-2">
        <SidebarLink item={SETTINGS} collapsed={collapsed} />
      </div>
    </aside>
  );
}

function BottomNav() {
  const { openNew } = useExpenseDialog();
  const items = [NAV[0], NAV[1], null, NAV[3], NAV[4]];
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-5 items-end px-2 pt-1.5">
        {items.map((item) =>
          item ? (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px]",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              <item.icon className="size-5" />
              {item.title}
            </NavLink>
          ) : (
            <div key="add" className="flex justify-center">
              <button
                type="button"
                onClick={openNew}
                aria-label="Add expense"
                className="-mt-6 flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft"
              >
                <Plus className="size-6" />
              </button>
            </div>
          ),
        )}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { openNew } = useExpenseDialog();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-svh w-full">
      <Sidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-background/85 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-7 md:inline-flex"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <PanelLeft />
          </Button>
          <span className="font-display text-lg md:hidden">Budget Bae</span>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={openNew} className="hidden rounded-full md:inline-flex">
              <Plus /> Add expense
            </Button>
            <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Settings">
              <Link to="/settings">
                <Settings className="size-5" />
              </Link>
            </Button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-2 md:px-6 md:pb-10">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
