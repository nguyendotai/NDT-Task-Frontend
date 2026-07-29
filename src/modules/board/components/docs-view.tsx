import { FileTextIcon } from "lucide-react";

export function DocsView() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 p-12 text-center">
      <FileTextIcon className="size-8 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">Docs — Coming soon</p>
      <p className="max-w-sm text-xs text-muted-foreground">
        Document collaboration for this Workspace is not available yet.
      </p>
    </div>
  );
}
