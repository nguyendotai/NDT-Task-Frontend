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

export interface BurndownPoint {
  date: string;
  remainingPoints: number;
}

export interface SprintBurndown {
  sprintId: string;
  totalPoints: number;
  startDate: string;
  endDate: string;
  idealLine: BurndownPoint[];
  actualLine: BurndownPoint[];
}

export interface SprintVelocity {
  sprintId: string;
  sprintName: string;
  velocity: number;
  completedAt: string;
}
