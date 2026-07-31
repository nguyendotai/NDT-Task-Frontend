import { baseApi } from "@/shared/services/base-api";
import type {
  Workspace,
  WorkspaceBoard,
  WorkspaceColumn,
  WorkspaceDetail,
  WorkspaceInvitation,
  WorkspaceInvitationAcceptResult,
  WorkspaceMember,
  WorkspaceRole,
  WorkspaceSummary,
  WorkspaceVisibility,
} from "../types/workspace.types";

interface CreateWorkspaceRequest {
  name: string;
  type: "KANBAN" | "SCRUM";
  description?: string;
  avatarEmoji?: string;
  avatarColor?: string;
}

interface UpdateWorkspaceRequest {
  id: string;
  name?: string;
  description?: string;
  visibility?: WorkspaceVisibility;
}

interface InviteMemberRequest {
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
}

interface UpdateMemberRoleRequest {
  workspaceId: string;
  memberId: string;
  role: WorkspaceRole;
}

interface RemoveMemberRequest {
  workspaceId: string;
  memberId: string;
}

interface CreateColumnRequest {
  workspaceId: string;
  name: string;
  isDoneColumn?: boolean;
}

interface UpdateColumnRequest {
  id: string;
  name?: string;
  isDoneColumn?: boolean;
}

interface ReorderColumnsRequest {
  workspaceId: string;
  orderedColumnIds: string[];
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
      providesTags: ["Workspace"],
    }),
    createWorkspace: builder.mutation<Workspace, CreateWorkspaceRequest>({
      query: (body) => ({ url: "/workspaces", method: "POST", body }),
      invalidatesTags: ["Workspace"],
    }),
    updateWorkspace: builder.mutation<Workspace, UpdateWorkspaceRequest>({
      query: ({ id, ...body }) => ({
        url: `/workspaces/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Workspace", id }, "Workspace"],
    }),
    deleteWorkspace: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/workspaces/${id}`, method: "DELETE" }),
      invalidatesTags: ["Workspace"],
    }),
    restoreWorkspace: builder.mutation<Workspace, string>({
      query: (id) => ({ url: `/workspaces/${id}/restore`, method: "POST" }),
      invalidatesTags: ["Workspace"],
    }),
    listArchivedWorkspaces: builder.query<Workspace[], void>({
      query: () => "/workspaces/archived",
      providesTags: ["Workspace"],
    }),
    starWorkspace: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/workspaces/${id}/star`, method: "POST" }),
      invalidatesTags: ["Workspace"],
    }),
    unstarWorkspace: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/workspaces/${id}/star`, method: "DELETE" }),
      invalidatesTags: ["Workspace"],
    }),
    listMembers: builder.query<WorkspaceMember[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/members`,
      providesTags: ["Workspace"],
    }),
    inviteMember: builder.mutation<WorkspaceInvitation, InviteMemberRequest>({
      query: ({ workspaceId, ...body }) => ({
        url: `/workspaces/${workspaceId}/members/invite`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Workspace"],
    }),
    updateMemberRole: builder.mutation<WorkspaceMember, UpdateMemberRoleRequest>({
      query: ({ workspaceId, memberId, role }) => ({
        url: `/workspaces/${workspaceId}/members/${memberId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Workspace"],
    }),
    removeMember: builder.mutation<Record<string, never>, RemoveMemberRequest>({
      query: ({ workspaceId, memberId }) => ({
        url: `/workspaces/${workspaceId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
    }),
    listInvitations: builder.query<WorkspaceInvitation[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/invitations`,
      providesTags: ["Workspace"],
    }),
    revokeInvitation: builder.mutation<
      Record<string, never>,
      { workspaceId: string; invitationId: string }
    >({
      query: ({ workspaceId, invitationId }) => ({
        url: `/workspaces/${workspaceId}/invitations/${invitationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
    }),
    acceptInvitation: builder.mutation<WorkspaceInvitationAcceptResult, string>({
      query: (token) => ({ url: `/workspaces/invitations/${token}/accept`, method: "POST" }),
      invalidatesTags: ["Workspace"],
    }),
    rejectInvitation: builder.mutation<Record<string, never>, string>({
      query: (token) => ({ url: `/workspaces/invitations/${token}/reject`, method: "POST" }),
    }),
    createColumn: builder.mutation<WorkspaceColumn, CreateColumnRequest>({
      query: ({ workspaceId, ...body }) => ({
        url: `/workspaces/${workspaceId}/columns`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Workspace"],
    }),
    updateColumn: builder.mutation<WorkspaceColumn, UpdateColumnRequest>({
      query: ({ id, ...body }) => ({
        url: `/columns/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Workspace"],
    }),
    deleteColumn: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/columns/${id}`, method: "DELETE" }),
      invalidatesTags: ["Workspace"],
    }),
    reorderColumns: builder.mutation<WorkspaceColumn[], ReorderColumnsRequest>({
      query: ({ workspaceId, orderedColumnIds }) => ({
        url: `/workspaces/${workspaceId}/columns/reorder`,
        method: "PATCH",
        body: { orderedColumnIds },
      }),
      invalidatesTags: ["Workspace"],
    }),
  }),
});

export const {
  useListMyWorkspacesQuery,
  useGetWorkspaceQuery,
  useGetWorkspaceBoardQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useRestoreWorkspaceMutation,
  useListArchivedWorkspacesQuery,
  useStarWorkspaceMutation,
  useUnstarWorkspaceMutation,
  useListMembersQuery,
  useInviteMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useListInvitationsQuery,
  useRevokeInvitationMutation,
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useReorderColumnsMutation,
} = workspaceApi;
