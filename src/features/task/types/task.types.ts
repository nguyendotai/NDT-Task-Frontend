export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskListScope = "assignee" | "assignee-or-creator";

export interface Task {
  id: string;
  columnId: string;
  workspaceId: string;
  workspaceName: string;
  sprintId?: string | null;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  order: number;
  backlogOrder?: number | null;
  startDate?: string | null;
  dueDate?: string | null;
  assigneeId?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}
