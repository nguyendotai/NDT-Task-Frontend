"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ColumnFormDialog } from "./column-form-dialog";

export function AddColumnButton({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-[calc(100vh-22rem)] min-h-[560px] w-64 shrink-0 flex-col gap-1.5 border-dashed text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="size-4" />
        Add column
      </Button>

      <ColumnFormDialog workspaceId={workspaceId} open={open} onOpenChange={setOpen} />
    </>
  );
}
