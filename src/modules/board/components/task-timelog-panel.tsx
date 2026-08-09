"use client";

import { useState } from "react";
import { ClockIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser } from "@/features/auth";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useCreateTimeLogMutation,
  useDeleteTimeLogMutation,
  useListTimeLogsQuery,
} from "@/features/timelog";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TaskTimeLogPanel({
  taskId,
  memberNameById,
}: {
  taskId: string;
  memberNameById: Map<string, string>;
}) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: timeLogs, isLoading } = useListTimeLogsQuery(taskId);
  const [createTimeLog, { isLoading: isCreating }] = useCreateTimeLogMutation();
  const [deleteTimeLog] = useDeleteTimeLogMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [hours, setHours] = useState("1");
  const [loggedDate, setLoggedDate] = useState(todayIso());
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const totalHours = (timeLogs ?? []).reduce((sum, log) => sum + log.hours, 0);

  const handleAdd = async () => {
    const hoursValue = Number(hours);
    if (!hoursValue || hoursValue <= 0) {
      setFormError("Enter a valid number of hours");
      return;
    }
    setFormError(null);
    try {
      await createTimeLog({
        taskId,
        hours: hoursValue,
        loggedDate,
        note: note.trim() || undefined,
      }).unwrap();
      setHours("1");
      setLoggedDate(todayIso());
      setNote("");
      setIsAdding(false);
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this time log entry?")) return;
    try {
      await deleteTimeLog({ id, taskId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <ClockIcon className="size-4" />
          Time Tracking
          {totalHours > 0 ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {totalHours}h logged
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => setIsAdding((prev) => !prev)}
        >
          {isAdding ? <XIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
          {isAdding ? "Cancel" : "Log time"}
        </Button>
      </div>

      {isAdding ? (
        <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/50 p-3">
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground" htmlFor="timelog-hours">
                Hours
              </label>
              <Input
                id="timelog-hours"
                type="number"
                min="0.1"
                max="24"
                step="0.25"
                value={hours}
                onChange={(event) => setHours(event.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground" htmlFor="timelog-date">
                Date
              </label>
              <Input
                id="timelog-date"
                type="date"
                value={loggedDate}
                onChange={(event) => setLoggedDate(event.target.value)}
              />
            </div>
            <div className="flex min-w-40 flex-1 flex-col gap-1">
              <label className="text-xs text-muted-foreground" htmlFor="timelog-note">
                Note (optional)
              </label>
              <Input
                id="timelog-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="What did you work on?"
              />
            </div>
          </div>
          {formError ? <p className="text-xs text-destructive">{formError}</p> : null}
          <div>
            <Button type="button" size="sm" disabled={isCreating} onClick={handleAdd}>
              {isCreating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="h-10 animate-pulse rounded-xl bg-muted/50" />
      ) : !timeLogs || timeLogs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No time logged yet.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {timeLogs.map((log) => {
            const canModify = log.userId === currentUser?.id;
            return (
              <div
                key={log.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{log.hours}h</span> by{" "}
                    {memberNameById.get(log.userId) ?? "Unknown"} · {formatDate(log.loggedDate)}
                  </p>
                  {log.note ? (
                    <p className="truncate text-xs text-muted-foreground">{log.note}</p>
                  ) : null}
                </div>
                {canModify ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete time log"
                    onClick={() => handleDelete(log.id)}
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
