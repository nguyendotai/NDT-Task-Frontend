export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export interface Sprint {
  id: string;
  workspaceId: string;
  name: string;
  goal?: string | null;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
