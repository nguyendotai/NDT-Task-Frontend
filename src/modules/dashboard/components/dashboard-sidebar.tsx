"use client";

import Link from "next/link";
import {
  ClockIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  MessageCircleIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { WorkspaceNavList } from "./workspace-nav-list";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "For you", href: "/dashboard", icon: SparklesIcon },
  { label: "Recent", href: "/dashboard", icon: ClockIcon },
  { label: "Starred", href: "/dashboard?tab=starred", icon: StarIcon },
];

export function DashboardSidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-4 border-r border-border/60 bg-background/60 px-3 py-4">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
          <LayoutGridIcon className="size-4.5" />
        </span>
        <span className="leading-tight">
          <span className="block font-heading text-sm font-bold tracking-wide">NDT</span>
          <span className="block text-[10px] font-medium tracking-widest text-muted-foreground">
            TASK
          </span>
        </span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="h-px bg-border/60" />

      <WorkspaceNavList />

      <div className="mt-auto flex flex-col gap-0.5 border-t border-border/60 pt-3">
        <button
          type="button"
          disabled
          className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/60"
        >
          <MessageCircleIcon className="size-4" />
          Chat
          <Badge variant="outline" className="ml-auto text-[10px]">
            Coming soon
          </Badge>
        </button>
      </div>
    </aside>
  );
}
