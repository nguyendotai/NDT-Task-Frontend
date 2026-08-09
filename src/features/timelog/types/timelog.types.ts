export interface TimeLog {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  loggedDate: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}
