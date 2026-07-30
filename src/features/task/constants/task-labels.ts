import type { TaskPriority } from "../types/task.types";

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const PRIORITY_BADGE_CLASS: Record<TaskPriority, string> = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  HIGH: "bg-destructive/10 text-destructive",
};
