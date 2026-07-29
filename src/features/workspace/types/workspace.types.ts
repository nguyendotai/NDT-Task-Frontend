export type WorkspaceType = "KANBAN" | "SCRUM";
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  description?: string | null;
  ownerId: string;
  shortCode: string;
  avatarEmoji: string;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSummary extends Workspace {
  myRole: WorkspaceRole;
  isStarred: boolean;
  lastAccessedAt: string;
  tasksCount: number;
}

export interface WorkspaceDetail extends Workspace {
  membersCount: number;
}

export interface WorkspaceColumn {
  id: string;
  boardId: string;
  name: string;
  order: number;
}

export interface WorkspaceBoard {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  columns: WorkspaceColumn[];
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  status: InvitationStatus;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}
