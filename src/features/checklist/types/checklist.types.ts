export interface ChecklistItem {
  id: string;
  taskId: string;
  title: string;
  isDone: boolean;
  order: number;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
