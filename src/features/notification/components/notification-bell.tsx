"use client";

import { BellIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useDeleteNotificationMutation,
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../api/notification.api";
import { useNotificationRealtime } from "../hooks/use-notification-realtime";
import type { Notification } from "../types/notification.types";

function formatRelativeTime(value: string): string {
  const diffSec = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(value).toLocaleDateString();
}

export function NotificationBell() {
  useNotificationRealtime();
  const { data: notifications, isLoading } = useListNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const unreadCount = notifications?.filter((notification) => !notification.isRead).length ?? 0;

  const handleItemClick = async (notification: Notification) => {
    if (notification.isRead) return;
    try {
      await markRead(notification.id).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleDelete = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <BellIcon className="size-4.5" />
            {unreadCount > 0 ? (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <button
            type="button"
            disabled={unreadCount === 0 || isMarkingAll}
            onClick={handleMarkAllRead}
            className="text-xs font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
          >
            Mark all as read
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-3">
              <div className="h-12 animate-pulse rounded-lg bg-muted/50" />
              <div className="h-12 animate-pulse rounded-lg bg-muted/50" />
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(notification)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleItemClick(notification);
                  }
                }}
                className={
                  "flex w-full cursor-pointer items-start gap-2 border-b border-border/40 px-3 py-2.5 text-left last:border-b-0 hover:bg-muted/60 " +
                  (notification.isRead ? "" : "bg-primary/5")
                }
              >
                <span
                  className={
                    "mt-1.5 size-1.5 shrink-0 rounded-full " +
                    (notification.isRead ? "bg-transparent" : "bg-primary")
                  }
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {notification.title}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Delete notification"
                  onClick={(event) => handleDelete(event, notification.id)}
                  className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
