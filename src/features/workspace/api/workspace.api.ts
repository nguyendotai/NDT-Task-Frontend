import { baseApi } from "@/shared/services/base-api";
import type {
  Workspace,
  WorkspaceBoard,
  WorkspaceDetail,
  WorkspaceSummary,
} from "../types/workspace.types";

interface CreateWorkspaceRequest {
  name: string;
  type: "KANBAN" | "SCRUM";
  description?: string;
  avatarEmoji?: string;
  avatarColor?: string;
}

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyWorkspaces: builder.query<WorkspaceSummary[], { starred?: boolean } | void>({
      query: (params) => ({
        url: "/workspaces",
        params: params?.starred ? { starred: "true" } : undefined,
      }),
      providesTags: ["Workspace"],
    }),
    getWorkspace: builder.query<WorkspaceDetail, string>({
      query: (id) => `/workspaces/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Workspace", id }],
    }),
    getWorkspaceBoard: builder.query<WorkspaceBoard, string>({
      query: (id) => `/workspaces/${id}/board`,
    }),
    createWorkspace: builder.mutation<Workspace, CreateWorkspaceRequest>({
      query: (body) => ({ url: "/workspaces", method: "POST", body }),
      invalidatesTags: ["Workspace"],
    }),
    starWorkspace: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/workspaces/${id}/star`, method: "POST" }),
      invalidatesTags: ["Workspace"],
    }),
    unstarWorkspace: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/workspaces/${id}/star`, method: "DELETE" }),
      invalidatesTags: ["Workspace"],
    }),
  }),
});

export const {
  useListMyWorkspacesQuery,
  useGetWorkspaceQuery,
  useGetWorkspaceBoardQuery,
  useCreateWorkspaceMutation,
  useStarWorkspaceMutation,
  useUnstarWorkspaceMutation,
} = workspaceApi;
