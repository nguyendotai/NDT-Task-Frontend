import { baseApi } from "@/shared/services/base-api";
import type {
  Task,
  TaskActivityEntry,
  TaskListScope,
  TaskPriority,
} from "../types/task.types";

interface ListMyTasksParams {
  done?: boolean;
  starred?: boolean;
  scope?: TaskListScope;
}

function toQueryParams(params?: ListMyTasksParams) {
  if (!params) return undefined;
  const query: Record<string, string> = {};
  if (params.done !== undefined) query.done = String(params.done);
  if (params.starred !== undefined) query.starred = String(params.starred);
  if (params.scope) query.scope = params.scope;
  return query;
}

interface ListWorkspaceTasksParams {
  workspaceId: string;
  done?: boolean;
  // Chỉ có ý nghĩa với Workspace loại Scrum (board.md #4): "backlog" = Task
  // chưa vào Sprint nào, 1 Sprint id cụ thể = chỉ Task thuộc đúng Sprint đó.
  sprintId?: string;
}

interface CreateTaskRequest {
  columnId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  storyPoints?: number;
  labels?: string[];
}

interface UpdateTaskRequest {
  id: string;
  // Chỉ dùng để patch optimistic cache của listTasksByWorkspace khi kéo thả
  // trên Board — không gửi lên server.
  workspaceId?: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  columnId?: string;
  order?: number;
  assigneeId?: string;
  storyPoints?: number;
  labels?: string[];
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyTasks: builder.query<Task[], ListMyTasksParams | void>({
      query: (params) => ({
        url: "/tasks/me",
        params: toQueryParams(params ?? undefined),
      }),
      providesTags: ["Task"],
    }),
    listTasksByWorkspace: builder.query<Task[], ListWorkspaceTasksParams>({
      query: ({ workspaceId, done, sprintId }) => ({
        url: `/workspaces/${workspaceId}/tasks`,
        params: {
          ...(done !== undefined ? { done: String(done) } : {}),
          ...(sprintId !== undefined ? { sprintId } : {}),
        },
      }),
      providesTags: ["Task"],
    }),
    listArchivedTasks: builder.query<Task[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/tasks/archived`,
      providesTags: ["Task"],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),
    listTaskActivity: builder.query<TaskActivityEntry[], string>({
      query: (id) => `/tasks/${id}/activity`,
      providesTags: (_result, _error, id) => [{ type: "Task", id: `${id}-activity` }],
    }),
    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<Task, UpdateTaskRequest>({
      query: ({ id, workspaceId, ...body }) => {
        void workspaceId;
        return { url: `/tasks/${id}`, method: "PATCH", body };
      },
      async onQueryStarted(
        { id, workspaceId, ...patch },
        { dispatch, queryFulfilled },
      ) {
        if (!workspaceId) return;
        const patchResult = dispatch(
          taskApi.util.updateQueryData(
            "listTasksByWorkspace",
            { workspaceId },
            (draft) => {
              const task = draft.find((item) => item.id === id);
              if (task) Object.assign(task, patch);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Task"],
    }),
    restoreTask: builder.mutation<Task, string>({
      query: (id) => ({ url: `/tasks/${id}/restore`, method: "POST" }),
      invalidatesTags: ["Task"],
    }),
    starTask: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/tasks/${id}/star`, method: "POST" }),
      invalidatesTags: ["Task"],
    }),
    unstarTask: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/tasks/${id}/star`, method: "DELETE" }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useListMyTasksQuery,
  useListTasksByWorkspaceQuery,
  useListArchivedTasksQuery,
  useGetTaskQuery,
  useListTaskActivityQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useRestoreTaskMutation,
  useStarTaskMutation,
  useUnstarTaskMutation,
} = taskApi;
