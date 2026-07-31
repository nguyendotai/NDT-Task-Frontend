export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
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
  // task.md #4: status luôn mirror tên Column hiện tại — không còn enum cố định.
  status: string;
  order: number;
  backlogOrder?: number | null;
  startDate?: string | null;
  dueDate?: string | null;
  assigneeIds: string[];
  // Bổ sung theo yêu cầu (không thuộc field chuẩn task.md) — hiển thị ở modal
  // chi tiết Task.
  storyPoints?: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}

export interface TaskActivityEntry {
  id: string;
  workspaceId: string;
  actorId: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface TaskWatcher {
  userId: string;
}
