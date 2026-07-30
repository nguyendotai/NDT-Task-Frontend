"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { useCreateColumnMutation } from "@/features/workspace";

export function AddColumnButton({ workspaceId }: { workspaceId: string }) {
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createColumn, { isLoading }] = useCreateColumnMutation();

  const reset = () => {
    setEditing(false);
    setName("");
    setError(null);
  };

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      reset();
      return;
    }
    setError(null);
    try {
      await createColumn({ workspaceId, name: trimmed }).unwrap();
      reset();
    } catch (err) {
      setError(getApiErrorMessage(err as never));
    }
  };

  if (!isEditing) {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-[calc(100vh-22rem)] min-h-[560px] w-64 shrink-0 flex-col gap-1.5 border-dashed text-muted-foreground"
        onClick={() => setEditing(true)}
      >
        <PlusIcon className="size-4" />
        Add column
      </Button>
    );
  }

  return (
    <div className="flex w-64 shrink-0 flex-col gap-2 rounded-2xl border border-border/60 bg-muted/30 p-3">
      <Input
        autoFocus
        placeholder="Column name"
        value={name}
        disabled={isLoading}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit();
          if (event.key === "Escape") reset();
        }}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="button" size="sm" disabled={isLoading} onClick={submit}>
          {isLoading ? "Adding..." : "Add"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={reset}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
