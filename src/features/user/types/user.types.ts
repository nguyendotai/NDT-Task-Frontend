export type SystemRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  settings: Record<string, unknown> | null;
  systemRole: SystemRole;
  createdAt: string;
  updatedAt: string;
}
