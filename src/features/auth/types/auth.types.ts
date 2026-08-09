export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  settings: Record<string, unknown> | null;
  systemRole: "USER" | "ADMIN";
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
