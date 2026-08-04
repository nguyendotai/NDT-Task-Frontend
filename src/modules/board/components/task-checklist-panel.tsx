"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquareIcon, GripVerticalIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useCompleteChecklistItemMutation,
  useCreateChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useListChecklistItemsQuery,
  useReopenChecklistItemMutation,
  useReorderChecklistItemsMutation,
  useUpdateChecklistItemMutation,
  type ChecklistItem,
} from "@/features/checklist";

function SortableChecklistRow({
  item,
  isEditing,
  editDraft,
  onEditDraftChange,
  onStartEdit,
  onToggle,
  onRename,
  onDelete,
}: {
  item: ChecklistItem;
  isEditing: boolean;
  editDraft: string;
  onEditDraftChange: (value: string) => void;
  onStartEdit: () => void;
  onToggle: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        "flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2 transition-opacity " +
        (isDragging ? "opacity-40" : "opacity-100")
      }
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <input
        type="checkbox"
        checked={item.isDone}
        onChange={onToggle}
        className="size-4 shrink-0 accent-primary"
        aria-label={`Mark "${item.title}" as ${item.isDone ? "incomplete" : "complete"}`}
      />
      {isEditing ? (
        <Input
          autoFocus
          value={editDraft}
          onChange={(event) => onEditDraftChange(event.target.value)}
          onBlur={onRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onRename();
            }
          }}
          className="h-7 flex-1"
        />
      ) : (
        <button
          type="button"
          className={
            "min-w-0 flex-1 truncate text-left text-sm " +
            (item.isDone ? "text-muted-foreground line-through" : "text-foreground")
          }
          onClick={onStartEdit}
        >
          {item.title}
        </button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Delete checklist item"
        onClick={onDelete}
      >
        <XIcon className="size-3.5" />
      </Button>
    </div>
  );
}

export function TaskChecklistPanel({ taskId }: { taskId: string }) {
  const { data: items, isLoading } = useListChecklistItemsQuery(taskId);
  const [createItem, { isLoading: isCreating }] = useCreateChecklistItemMutation();
  const [updateItem] = useUpdateChecklistItemMutation();
  const [completeItem] = useCompleteChecklistItemMutation();
  const [reopenItem] = useReopenChecklistItemMutation();
  const [reorderItems] = useReorderChecklistItemsMutation();
  const [deleteItem] = useDeleteChecklistItemMutation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!items || !over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const orderedChecklistIds = arrayMove(items, oldIndex, newIndex).map(
      (item) => item.id,
    );
    try {
      await reorderItems({ taskId, orderedChecklistIds }).unwrap();
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
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1.5">
              {items.map((item) => (
                <SortableChecklistRow
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  editDraft={editDraft}
                  onEditDraftChange={setEditDraft}
                  onStartEdit={() => {
                    setEditingId(item.id);
                    setEditDraft(item.title);
                  }}
                  onToggle={() => handleToggle(item.id, item.isDone)}
                  onRename={() => handleRename(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
