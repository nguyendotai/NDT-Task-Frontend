"use client";

import Link from "next/link";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { AccountMenu } from "@/features/auth";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
      <div className="relative w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        {/* Search is a UI placeholder — Backend has no search API yet, so it isn't wired up. */}
        <Input placeholder="Search workspaces, tasks..." className="pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Button
          render={<Link href="/workspaces/new" />}
          className="gap-1.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90"
        >
          <PlusIcon className="size-4" />
          Create Workspace
        </Button>
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}
