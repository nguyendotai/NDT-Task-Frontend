export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "COMMENT_ADDED"
  | "MENTION"
  | "WORKSPACE_INVITATION"
  | "SPRINT_STARTED"
  | "SPRINT_COMPLETED"
  | "ATTACHMENT_ADDED";

export interface Notification {
  id: string;
  workspaceId: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}
