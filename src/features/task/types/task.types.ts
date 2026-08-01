export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskType = "TASK" | "BUG" | "STORY" | "EPIC";
export type TaskListScope = "assignee" | "assignee-or-creator";

export interface Task {
  id: string;
  columnId: string;
  workspaceId: string;
  workspaceName: string;
  // Dùng để tự ghép mã Task hiển thị qua getTaskKey().
  workspaceShortCode: string;
  sprintId?: string | null;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  // Bổ sung theo yêu cầu (không thuộc field chuẩn task.md) — dùng cho Filter
  // Board/List.
  type: TaskType;
  // Số thứ tự tăng dần riêng theo Workspace — ghép với workspaceShortCode
  // thành mã Task qua getTaskKey().
  taskNumber: number;
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

// Mã Task hiển thị dạng "{shortCode}-{taskNumber}" (VD "YJFTJ-1") — ghép ở
// Frontend, Backend chỉ trả 2 field thô workspaceShortCode/taskNumber.
export function getTaskKey(task: Pick<Task, "workspaceShortCode" | "taskNumber">): string {
  return `${task.workspaceShortCode}-${task.taskNumber}`;
}

// Dùng cho thanh Search+Filter ở Board/List (lọc client-side trên dữ liệu
// Task đã fetch sẵn) — mỗi nhóm rỗng = không lọc nhóm đó.
export interface TaskFilterState {
  status: string[];
  assigneeIds: string[];
  priority: TaskPriority[];
  type: TaskType[];
}

export const EMPTY_TASK_FILTER_STATE: TaskFilterState = {
  status: [],
  assigneeIds: [],
  priority: [],
  type: [],
};
