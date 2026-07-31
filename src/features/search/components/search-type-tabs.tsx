"use client";

import { cn } from "@/shared/lib/utils";
import type { SearchEntityType } from "../types/search.types";

const TABS: { label: string; value: SearchEntityType | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Tasks", value: "task" },
  { label: "Comments", value: "comment" },
  { label: "Attachments", value: "attachment" },
  { label: "Members", value: "member" },
  { label: "Sprints", value: "sprint" },
  { label: "Columns", value: "column" },
];

interface SearchTypeTabsProps {
  value: SearchEntityType | undefined;
  onChange: (value: SearchEntityType | undefined) => void;
}

export function SearchTypeTabs({ value, onChange }: SearchTypeTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60 px-2 py-1.5">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
            value === tab.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
