import type { Task } from "../types/task.types";
import { getTaskKey } from "../types/task.types";

const CSV_HEADERS = [
  "Key",
  "Title",
  "Type",
  "Column",
  "Priority",
  "Due date",
  "Assignees",
  "Story points",
  "Created at",
];

function escapeCsvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function tasksToCsv(
  tasks: Task[],
  context: { columnNameById: Map<string, string>; assigneeNameById: Map<string, string> },
): string {
  const lines = [CSV_HEADERS.join(",")];
  for (const task of tasks) {
    const assignees = task.assigneeIds
      .map((id) => context.assigneeNameById.get(id))
      .filter((name): name is string => !!name)
      .join("; ");
    lines.push(
      [
        getTaskKey(task),
        task.title,
        task.type,
        context.columnNameById.get(task.columnId) ?? "",
        task.priority,
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
        assignees,
        task.storyPoints?.toString() ?? "",
        new Date(task.createdAt).toLocaleDateString(),
      ]
        .map((field) => escapeCsvField(String(field)))
        .join(","),
    );
  }
  return lines.join("\r\n");
}

export function downloadCsv(content: string, filename: string): void {
  // Thêm BOM để Excel (Windows) tự nhận UTF-8, không bị lỗi font tiếng Việt.
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
