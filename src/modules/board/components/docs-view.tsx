"use client";

import { useMemo, useState } from "react";
import { FileTextIcon, PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser } from "@/features/auth";
import { useListMembersQuery } from "@/features/workspace";
import { useGetDocQuery, useListDocsQuery } from "@/features/docs";
import { DocEditorPanel } from "./doc-editor-panel";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function DocsView({ workspaceId }: { workspaceId: string }) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: docs, isLoading } = useListDocsQuery(workspaceId);
  const { data: members } = useListMembersQuery(workspaceId);

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: selectedDoc } = useGetDocQuery(selectedDocId ?? "", {
    skip: !selectedDocId,
  });

  const currentMember = useMemo(
    () => members?.find((member) => member.user.id === currentUser?.id),
    [members, currentUser],
  );
  const isOwnerOrAdmin =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const memberNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const member of members ?? []) {
      map.set(member.user.id, member.user.name);
    }
    return map;
  }, [members]);

  const selectDoc = (docId: string) => {
    setIsCreating(false);
    setSelectedDocId(docId);
  };

  const startCreating = () => {
    setSelectedDocId(null);
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-xl bg-muted/50" />
        ))}
      </div>
    );
  }

  const showPanel = isCreating || (selectedDocId && selectedDoc);
  const canModifySelected =
    !!selectedDoc &&
    (isOwnerOrAdmin || selectedDoc.createdBy === currentUser?.id);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          onClick={startCreating}
        >
          <PlusIcon className="size-3.5" />
          New doc
        </Button>

        {docs && docs.length > 0 ? (
          <div className="flex flex-col gap-1">
            {docs.map((docSummary) => (
              <button
                key={docSummary.id}
                type="button"
                onClick={() => selectDoc(docSummary.id)}
                className={`flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors ${
                  selectedDocId === docSummary.id
                    ? "border-primary/40 bg-accent"
                    : "border-border/60 bg-card hover:bg-accent/60"
                }`}
              >
                <span className="w-full truncate text-sm font-medium text-foreground">
                  {docSummary.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {memberNameById.get(docSummary.createdBy) ?? "Unknown"} ·{" "}
                  {formatDate(docSummary.updatedAt)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
            No docs yet.
          </p>
        )}
      </div>

      <div>
        {showPanel ? (
          <DocEditorPanel
            workspaceId={workspaceId}
            doc={isCreating ? null : (selectedDoc ?? null)}
            authorName={
              selectedDoc ? memberNameById.get(selectedDoc.createdBy) : undefined
            }
            canModify={isCreating || canModifySelected}
            isCreating={isCreating}
            onCreated={(docId) => {
              setIsCreating(false);
              setSelectedDocId(docId);
            }}
            onDeleted={() => setSelectedDocId(null)}
            onCancelCreate={() => setIsCreating(false)}
          />
        ) : (
          <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 p-12 text-center">
            <FileTextIcon className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Select a doc or create a new one
            </p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Docs are shared with every member of this workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
