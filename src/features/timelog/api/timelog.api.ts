import { baseApi } from "@/shared/services/base-api";
import type { TimeLog } from "../types/timelog.types";

interface CreateTimeLogRequest {
  taskId: string;
  hours: number;
  loggedDate: string;
  note?: string;
}

interface UpdateTimeLogRequest {
  id: string;
  taskId: string;
  hours?: number;
  loggedDate?: string;
  note?: string;
}

interface DeleteTimeLogRequest {
  id: string;
  taskId: string;
}

export const timeLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTimeLogs: builder.query<TimeLog[], string>({
      query: (taskId) => `/tasks/${taskId}/timelogs`,
      providesTags: (_result, _error, taskId) => [
        { type: "TimeLog", id: taskId },
      ],
    }),
    createTimeLog: builder.mutation<TimeLog, CreateTimeLogRequest>({
      query: ({ taskId, ...body }) => ({
        url: `/tasks/${taskId}/timelogs`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "TimeLog", id: taskId },
      ],
    }),
    updateTimeLog: builder.mutation<TimeLog, UpdateTimeLogRequest>({
      query: ({ id, hours, loggedDate, note }) => ({
        url: `/timelogs/${id}`,
        method: "PATCH",
        body: { hours, loggedDate, note },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "TimeLog", id: taskId },
      ],
    }),
    deleteTimeLog: builder.mutation<Record<string, never>, DeleteTimeLogRequest>({
      query: ({ id }) => ({ url: `/timelogs/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "TimeLog", id: taskId },
      ],
    }),
  }),
});

export const {
  useListTimeLogsQuery,
  useCreateTimeLogMutation,
  useUpdateTimeLogMutation,
  useDeleteTimeLogMutation,
} = timeLogApi;
