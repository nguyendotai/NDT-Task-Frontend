import { toast } from "sonner";
import { baseApi } from "@/shared/services/base-api";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import type {
  Task,
  TaskActivityEntry,
  TaskListScope,
  TaskPriority,
  TaskType,
  TaskWatcher,
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
  type?: TaskType;
  startDate?: string;
  dueDate?: string;
  storyPoints?: number;
}

interface UpdateTaskRequest {
  id: string;
  // Chỉ dùng để patch optimistic cache của listTasksByWorkspace khi kéo thả
  // trên Board — không gửi lên server. sprintId phải khớp đúng key cache mà
  // Board đang query (Workspace Scrum lọc theo Sprint Active nên query kèm
  // sprintId — thiếu field này thì patch nhắm sai cache, kéo-thả không thấy
  // cập nhật ngay mà phải đợi tag "Task" invalidate rồi refetch).
  workspaceId?: string;
  sprintId?: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  type?: TaskType;
  startDate?: string;
  dueDate?: string;
  columnId?: string;
  order?: number;
  assigneeIds?: string[];
  storyPoints?: number;
}

interface AddWatcherRequest {
  taskId: string;
  userId?: string;
}

interface RemoveWatcherRequest {
  taskId: string;
  userId: string;
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
      query: ({ id, workspaceId, sprintId, ...body }) => {
        void workspaceId;
        void sprintId;
        return { url: `/tasks/${id}`, method: "PATCH", body };
      },
      async onQueryStarted(
        { id, workspaceId, sprintId, ...patch },
        { dispatch, queryFulfilled },
      ) {
        if (!workspaceId) return;
        const patchResult = dispatch(
          taskApi.util.updateQueryData(
            "listTasksByWorkspace",
            { workspaceId, sprintId },
            (draft) => {
              const task = draft.find((item) => item.id === id);
              if (task) Object.assign(task, patch);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
          // Vd. Member kéo-thả Task của người khác (không phải người tạo/được
          // gán) — trước đây UI chỉ âm thầm "nhảy về" vị trí cũ không rõ lý do.
          const typedErr = err as { error?: Parameters<typeof getApiErrorMessage>[0] };
          toast.error(getApiErrorMessage(typedErr.error));
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
    listWatchers: builder.query<TaskWatcher[], string>({
      query: (taskId) => `/tasks/${taskId}/watchers`,
      providesTags: (_result, _error, taskId) => [
        { type: "Watcher", id: taskId },
      ],
    }),
    addWatcher: builder.mutation<Record<string, never>, AddWatcherRequest>({
      query: ({ taskId, userId }) => ({
        url: `/tasks/${taskId}/watchers`,
        method: "POST",
        body: userId ? { userId } : {},
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Watcher", id: taskId },
      ],
    }),
    removeWatcher: builder.mutation<Record<string, never>, RemoveWatcherRequest>({
      query: ({ taskId, userId }) => ({
        url: `/tasks/${taskId}/watchers/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Watcher", id: taskId },
      ],
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
  useListWatchersQuery,
  useAddWatcherMutation,
  useRemoveWatcherMutation,
} = taskApi;
