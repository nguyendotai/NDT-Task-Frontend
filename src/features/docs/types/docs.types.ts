export interface DocSummary {
  id: string;
  workspaceId: string;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doc extends DocSummary {
  content: Record<string, unknown> | null;
}
