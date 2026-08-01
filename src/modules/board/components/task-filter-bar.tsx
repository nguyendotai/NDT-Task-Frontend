"use client";

import { useEffect, useRef, useState } from "react";
import { FilterIcon, SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { TYPE_LABEL, type TaskFilterState, type TaskPriority, type TaskType } from "@/features/task";
import type { WorkspaceColumn, WorkspaceMember } from "@/features/workspace";

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

const TYPE_OPTIONS: { value: TaskType; label: string }[] = (
  Object.keys(TYPE_LABEL) as TaskType[]
).map((value) => ({ value, label: TYPE_LABEL[value] }));

type FilterCategory = "status" | "assignee" | "priority" | "type";

const CATEGORIES: { key: FilterCategory; label: string; searchPlaceholder: string }[] = [
  { key: "status", label: "Status", searchPlaceholder: "Search statuses..." },
  { key: "assignee", label: "Assignee", searchPlaceholder: "Search assignees..." },
  { key: "priority", label: "Priority", searchPlaceholder: "Search priorities..." },
  { key: "type", label: "Task type", searchPlaceholder: "Search task types..." },
];

interface TaskFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  filters: TaskFilterState;
  onFiltersChange: (filters: TaskFilterState) => void;
  columns: WorkspaceColumn[];
  members: WorkspaceMember[];
}

export function TaskFilterBar({
  searchTerm,
  onSearchTermChange,
  filters,
  onFiltersChange,
  columns,
  members,
}: TaskFilterBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("status");
  const [optionSearch, setOptionSearch] = useState("");

  const activeFilterCount =
    filters.status.length + filters.assigneeIds.length + filters.priority.length + filters.type.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleValue = (category: FilterCategory, value: string) => {
    if (category === "status") {
      const next = filters.status.includes(value)
        ? filters.status.filter((item) => item !== value)
        : [...filters.status, value];
      onFiltersChange({ ...filters, status: next });
    } else if (category === "assignee") {
      const next = filters.assigneeIds.includes(value)
        ? filters.assigneeIds.filter((item) => item !== value)
        : [...filters.assigneeIds, value];
      onFiltersChange({ ...filters, assigneeIds: next });
    } else if (category === "priority") {
      const priority = value as TaskPriority;
      const next = filters.priority.includes(priority)
        ? filters.priority.filter((item) => item !== priority)
        : [...filters.priority, priority];
      onFiltersChange({ ...filters, priority: next });
    } else {
      const type = value as TaskType;
      const next = filters.type.includes(type)
        ? filters.type.filter((item) => item !== type)
        : [...filters.type, type];
      onFiltersChange({ ...filters, type: next });
    }
  };

  const optionsForCategory = (): { value: string; label: string; checked: boolean }[] => {
    const term = optionSearch.trim().toLowerCase();
    if (activeCategory === "status") {
      return columns
        .map((column) => ({
          value: column.name,
          label: column.name,
          checked: filters.status.includes(column.name),
        }))
        .filter((option) => option.label.toLowerCase().includes(term));
    }
    if (activeCategory === "assignee") {
      return members
        .map((member) => ({
          value: member.user.id,
          label: member.user.name,
          checked: filters.assigneeIds.includes(member.user.id),
        }))
        .filter((option) => option.label.toLowerCase().includes(term));
    }
    if (activeCategory === "priority") {
      return PRIORITY_OPTIONS.map((option) => ({
        ...option,
        checked: filters.priority.includes(option.value),
      })).filter((option) => option.label.toLowerCase().includes(term));
    }
    return TYPE_OPTIONS.map((option) => ({
      ...option,
      checked: filters.type.includes(option.value),
    })).filter((option) => option.label.toLowerCase().includes(term));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-64">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search tasks..."
          className="pl-9"
        />
      </div>

      <div ref={containerRef} className="relative">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("gap-1.5", activeFilterCount > 0 && "border-primary text-primary")}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <FilterIcon className="size-3.5" />
          Filter
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>

        {isOpen ? (
          <div className="absolute top-full left-0 z-50 mt-2 flex h-80 w-[420px] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md">
            <div className="w-32 shrink-0 overflow-y-auto border-r border-border/60 py-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.key);
                    setOptionSearch("");
                  }}
                  className={cn(
                    "block w-full border-l-2 px-3 py-2 text-left text-sm",
                    activeCategory === category.key
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="flex flex-1 flex-col overflow-hidden p-2">
              <Input
                value={optionSearch}
                onChange={(event) => setOptionSearch(event.target.value)}
                placeholder={CATEGORIES.find((c) => c.key === activeCategory)?.searchPlaceholder}
                className="mb-2 shrink-0"
              />
              <div className="flex-1 overflow-y-auto">
                {optionsForCategory().map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={() => toggleValue(activeCategory, option.value)}
                      className="size-3.5 accent-primary"
                    />
                    {option.label}
                  </label>
                ))}
                {optionsForCategory().length === 0 ? (
                  <p className="px-2 py-1.5 text-sm text-muted-foreground">No options</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
