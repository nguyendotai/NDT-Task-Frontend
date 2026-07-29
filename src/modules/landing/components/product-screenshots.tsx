"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";

const SCREENSHOTS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "kanban", label: "Kanban" },
  { key: "backlog", label: "Backlog" },
  { key: "sprint", label: "Sprint" },
  { key: "task-detail", label: "Task Detail" },
] as const;

// Ảnh minh hoạ dạng mockup trừu tượng — chưa có screenshot thật của sản phẩm.
function MockupPreview({ variant }: { variant: (typeof SCREENSHOTS)[number]["key"] }) {
  if (variant === "kanban") {
    return (
      <div className="grid h-full grid-cols-3 gap-3 p-6">
        {[0, 1, 2].map((col) => (
          <div key={col} className="flex flex-col gap-3 rounded-lg bg-background/80 p-3">
            {[0, 1].map((row) => (
              <div key={row} className="h-16 rounded-md bg-gradient-to-br from-blue-500/20 to-violet-500/20" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "backlog" || variant === "sprint") {
    return (
      <div className="flex h-full flex-col gap-3 p-6">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="flex h-12 items-center gap-3 rounded-lg bg-background/80 px-4">
            <div className="size-2 rounded-full bg-blue-500" />
            <div className="h-2 w-2/3 rounded-full bg-muted-foreground/20" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "task-detail") {
    return (
      <div className="grid h-full grid-cols-3 gap-3 p-6">
        <div className="col-span-2 flex flex-col gap-3">
          <div className="h-8 w-2/3 rounded-md bg-background/80" />
          <div className="flex-1 rounded-lg bg-background/80" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-20 rounded-lg bg-background/80" />
          <div className="h-20 rounded-lg bg-background/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-4 gap-3 p-6">
      <div className="col-span-1 rounded-lg bg-background/80" />
      <div className="col-span-3 grid grid-rows-3 gap-3">
        <div className="rounded-lg bg-background/80" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20" />
          ))}
        </div>
        <div className="rounded-lg bg-background/80" />
      </div>
    </div>
  );
}

export function ProductScreenshots() {
  const [active, setActive] = useState<(typeof SCREENSHOTS)[number]["key"]>("dashboard");

  return (
    <section id="screenshots" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          See NDT Task in action
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Từ Dashboard tổng quan đến chi tiết từng Task — mọi thứ đều trực quan.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {SCREENSHOTS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            aria-pressed={active === tab.key}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === tab.key
                ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-xl shadow-blue-500/5 ring-1 ring-foreground/5">
        <div className="aspect-16/9 w-full bg-gradient-to-br from-muted to-muted/40">
          <MockupPreview variant={active} />
        </div>
      </div>
    </section>
  );
}
