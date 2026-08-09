"use client";

import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/features/user";

// notification.md #5.1.1: khoá lưu trong User.settings.notificationPreferences
// (object tự do, chưa validate cấu trúc ở Backend) — chỉ ảnh hưởng Notification
// in-app, không đổi hành vi email nghiệp vụ bắt buộc (mời Workspace...).
const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  TASK_ASSIGNED: "Assigned to a Task",
  TASK_UPDATED: "Task updates",
  COMMENT_ADDED: "New comments",
  MENTION: "Mentions",
  WORKSPACE_INVITATION: "Workspace invitations",
  SPRINT_STARTED: "Sprint started",
  SPRINT_COMPLETED: "Sprint completed",
  ATTACHMENT_ADDED: "New attachments",
};

const NOTIFICATION_TYPES = Object.keys(NOTIFICATION_TYPE_LABELS);

export function NotificationPreferencesSection() {
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  if (!profile) return null;

  const preferences =
    (profile.settings?.notificationPreferences as Record<string, boolean> | undefined) ?? {};

  const handleToggle = (type: string, checked: boolean) => {
    updateProfile({
      settings: {
        ...profile.settings,
        notificationPreferences: { ...preferences, [type]: checked },
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6">
      <div>
        <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Notifications
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose which in-app notifications you want to receive. This doesn&apos;t
          affect essential emails like Workspace invitations or password resets.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {NOTIFICATION_TYPES.map((type) => (
          <div key={type} className="flex items-center justify-between gap-3">
            <Label htmlFor={`notif-${type}`} className="font-normal text-foreground">
              {NOTIFICATION_TYPE_LABELS[type]}
            </Label>
            <Switch
              id={`notif-${type}`}
              checked={preferences[type] ?? true}
              disabled={isLoading}
              onCheckedChange={(checked) => handleToggle(type, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
