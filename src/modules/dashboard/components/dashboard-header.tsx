"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { AccountMenu } from "@/features/auth";
import { NotificationBell } from "@/features/notification";
import { SearchBox } from "@/features/search";

export function DashboardHeader() {
  const params = useParams<{ id?: string }>();
  const workspaceId = typeof params.id === "string" ? params.id : undefined;

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
      <SearchBox workspaceId={workspaceId} />
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Button
          nativeButton={false}
          render={<Link href="/workspaces/new" />}
          className="gap-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:opacity-90"
        >
          <PlusIcon className="size-4" />
          Create Workspace
        </Button>
        <NotificationBell />
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}
