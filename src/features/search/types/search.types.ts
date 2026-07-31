export const SEARCH_ENTITY_TYPES = [
  "task",
  "comment",
  "attachment",
  "member",
  "sprint",
  "column",
] as const;

export type SearchEntityType = (typeof SEARCH_ENTITY_TYPES)[number];

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
}

export interface CommentSearchResult {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface AttachmentSearchResult {
  id: string;
  taskId: string;
  fileName: string;
  mimeType: string;
  createdAt: string;
}

export interface MemberSearchResult {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface SprintSearchResult {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface ColumnSearchResult {
  id: string;
  name: string;
  boardId: string;
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
