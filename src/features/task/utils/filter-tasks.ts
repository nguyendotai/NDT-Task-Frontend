import type { Task, TaskFilterState } from "../types/task.types";

// Lọc client-side trên danh sách Task đã fetch sẵn (Board/List tải toàn bộ 1
// lần, không phân trang) — dùng chung giữa BoardView và ListView. searchTerm
// khớp theo title, không phân biệt hoa/thường, khớp dần theo từng ký tự gõ.
export function filterTasks(
  tasks: Task[],
  searchTerm: string,
  filters: TaskFilterState,
): Task[] {
  const term = searchTerm.trim().toLowerCase();
  return tasks.filter((task) => {
    if (term && !task.title.toLowerCase().includes(term)) return false;
    if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
    if (
      filters.assigneeIds.length > 0 &&
      !task.assigneeIds.some((id) => filters.assigneeIds.includes(id))
    ) {
      return false;
    }
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
    if (filters.type.length > 0 && !filters.type.includes(task.type)) return false;
    return true;
  });
}
