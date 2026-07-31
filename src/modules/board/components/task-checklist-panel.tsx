"use client";

import { useState } from "react";
import { CheckSquareIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useCompleteChecklistItemMutation,
  useCreateChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useListChecklistItemsQuery,
  useReopenChecklistItemMutation,
  useUpdateChecklistItemMutation,
} from "@/features/checklist";

export function TaskChecklistPanel({ taskId }: { taskId: string }) {
  const { data: items, isLoading } = useListChecklistItemsQuery(taskId);
  const [createItem, { isLoading: isCreating }] = useCreateChecklistItemMutation();
  const [updateItem] = useUpdateChecklistItemMutation();
  const [completeItem] = useCompleteChecklistItemMutation();
  const [reopenItem] = useReopenChecklistItemMutation();
  const [deleteItem] = useDeleteChecklistItemMutation();

  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const total = items?.length ?? 0;
  const done = items?.filter((item) => item.isDone).length ?? 0;

  const handleCreate = async () => {
    const title = draft.trim();
    if (!title) return;
    try {
      await createItem({ taskId, title }).unwrap();
      setDraft("");
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleToggle = async (id: string, isDone: boolean) => {
    try {
      if (isDone) {
        await reopenItem({ id, taskId }).unwrap();
      } else {
        await completeItem({ id, taskId }).unwrap();
      }
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleRename = async (id: string) => {
    const title = editDraft.trim();
    setEditingId(null);
    if (!title) return;
    try {
      await updateItem({ id, taskId, title }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem({ id, taskId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <CheckSquareIcon className="size-4" />
          Checklist
          {total > 0 ? (
            <span className="text-xs font-normal text-muted-foreground">
              {done}/{total}
            </span>
          ) : null}
        </div>
      </div>

      {total > 0 ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.round((done / total) * 100)}%` }}
          />
        </div>
      ) : null}

      {isLoading ? (
        <div className="h-12 animate-pulse rounded-xl bg-muted/50" />
      ) : !items || items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No checklist items yet.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={item.isDone}
                onChange={() => handleToggle(item.id, item.isDone)}
                className="size-4 shrink-0 accent-primary"
                aria-label={`Mark "${item.title}" as ${item.isDone ? "incomplete" : "complete"}`}
              />
              {editingId === item.id ? (
                <Input
                  autoFocus
                  value={editDraft}
                  onChange={(event) => setEditDraft(event.target.value)}
                  onBlur={() => handleRename(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleRename(item.id);
                    }
                  }}
                  className="h-7 flex-1"
                />
              ) : (
                <button
                  type="button"
                  className={
                    "min-w-0 flex-1 truncate text-left text-sm " +
                    (item.isDone
                      ? "text-muted-foreground line-through"
                      : "text-foreground")
                  }
                  onClick={() => {
                    setEditingId(item.id);
                    setEditDraft(item.title);
                  }}
                >
                  {item.title}
                </button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Delete checklist item"
                onClick={() => handleDelete(item.id)}
              >
                <XIcon className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Add a checklist item"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleCreate();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isCreating || !draft.trim()}
          onClick={handleCreate}
          aria-label="Add checklist item"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
