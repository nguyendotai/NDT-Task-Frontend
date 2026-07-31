import { baseApi } from "@/shared/services/base-api";
import type { Notification } from "../types/notification.types";

interface ListNotificationsParams {
  unread?: boolean;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<Notification[], ListNotificationsParams | void>({
      query: (params) => ({
        url: "/notifications",
        params: params?.unread ? { unread: "true" } : undefined,
      }),
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation<Record<string, never>, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
