"use client";

import { useState } from "react";
import { PlusIcon, TagIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useListLabelsQuery,
} from "@/features/label";

const DEFAULT_COLOR = "#3B82F6";

export function TaskLabelsPanel({ taskId }: { taskId: string }) {
  const { data: labels, isLoading } = useListLabelsQuery(taskId);
  const [createLabel, { isLoading: isCreating }] = useCreateLabelMutation();
  const [deleteLabel] = useDeleteLabelMutation();

  const [nameDraft, setNameDraft] = useState("");
  const [colorDraft, setColorDraft] = useState(DEFAULT_COLOR);

  const handleCreate = async () => {
    const name = nameDraft.trim();
    if (!name) return;
    try {
      await createLabel({ taskId, name, color: colorDraft }).unwrap();
      setNameDraft("");
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLabel({ id, taskId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <TagIcon className="size-3.5" />
        Labels
      </div>

      {isLoading ? (
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted/50" />
      ) : labels && labels.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <span
              key={label.id}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${label.color}26`, color: label.color }}
            >
              {label.name}
              <button
                type="button"
                aria-label={`Remove label ${label.name}`}
                onClick={() => handleDelete(label.id)}
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">None</p>
      )}

      <div className="flex items-center gap-1.5">
        <input
          type="color"
          value={colorDraft}
          onChange={(event) => setColorDraft(event.target.value)}
          className="size-8 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
          aria-label="Label color"
        />
        <Input
          placeholder="New label"
          value={nameDraft}
          onChange={(event) => setNameDraft(event.target.value)}
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
          disabled={isCreating || !nameDraft.trim()}
          onClick={handleCreate}
          aria-label="Add label"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
