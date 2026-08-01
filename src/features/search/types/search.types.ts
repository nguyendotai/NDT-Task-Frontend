export const SEARCH_ENTITY_TYPES = [
  "task",
  "comment",
  "attachment",
  "member",
  "sprint",
  "column",
] as const;

export type SearchEntityType = (typeof SEARCH_ENTITY_TYPES)[number];

// Chỉ có ý nghĩa phân biệt ở Global Search (nhiều Workspace) — search theo 1
// Workspace vẫn trả field này nhưng luôn chỉ 1 giá trị cố định.
export interface WorkspaceRef {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
}

export interface TaskSearchResult {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  columnId: string;
  sprintId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  workspace: WorkspaceRef;
}

export interface CommentSearchResult {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
  workspace: WorkspaceRef;
}

export interface AttachmentSearchResult {
  id: string;
  taskId: string;
  fileName: string;
  mimeType: string;
  createdAt: string;
  workspace: WorkspaceRef;
}

export interface MemberSearchResult {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  workspace: WorkspaceRef;
}

export interface SprintSearchResult {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  workspace: WorkspaceRef;
}

export interface ColumnSearchResult {
  id: string;
  name: string;
  boardId: string;
  workspace: WorkspaceRef;
}

export interface SearchResults {
  tasks: TaskSearchResult[];
  comments: CommentSearchResult[];
  attachments: AttachmentSearchResult[];
  members: MemberSearchResult[];
  sprints: SprintSearchResult[];
  columns: ColumnSearchResult[];
}

export interface SearchParams {
  workspaceId: string;
  q: string;
  type?: SearchEntityType;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: string;
  assigneeId?: string;
  reporterId?: string;
  done?: boolean;
  label?: string;
  sprintId?: string;
  columnId?: string;
  dateFrom?: string;
  dateTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "dueDate";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface LabelFilterOption {
  name: string;
  color: string;
}

// Tập filter chỉ có ý nghĩa với type=task (search.md #4.3), dùng chung giữa
// SearchBox (dropdown) và trang Advanced Search.
export interface SearchTaskFilters {
  assigneeId?: string;
  reporterId?: string;
  done?: boolean;
  label?: string;
  sprintId?: string;
  updatedFrom?: string;
  updatedTo?: string;
}

export const EMPTY_TASK_FILTERS: SearchTaskFilters = {};
