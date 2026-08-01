import type { TaskPriority, TaskType } from "../types/task.types";

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

export const TYPE_LABEL: Record<TaskType, string> = {
  TASK: "Task",
  BUG: "Bug",
  STORY: "Story",
  EPIC: "Epic",
};

export const TYPE_BADGE_CLASS: Record<TaskType, string> = {
  TASK: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  BUG: "bg-destructive/10 text-destructive",
  STORY: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  EPIC: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
};
