"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { AccountMenu } from "@/features/auth";
import { CreateWorkspaceDialog } from "@/features/workspace";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
      <div className="relative w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        {/* Search is a UI placeholder — Backend has no search API yet, so it isn't wired up. */}
        <Input placeholder="Search workspaces, tasks..." className="pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <CreateWorkspaceDialog />
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}
