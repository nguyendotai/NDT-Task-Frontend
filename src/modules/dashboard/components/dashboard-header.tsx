"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { AccountMenu } from "@/features/auth";
import { CreateWorkspaceDialog } from "@/features/workspace";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
      <div className="relative w-full max-w-sm flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        {/* Tìm kiếm hiện là UI placeholder — chưa có API search ở Backend nên chưa nối logic thật. */}
        <Input placeholder="Tìm kiếm Workspace, Task..." className="pl-9" />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <CreateWorkspaceDialog />
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}
