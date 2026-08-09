"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useDebouncedValue } from "@/shared/hooks/use-debounce";
import {
  SearchTypeTabs,
  SearchFiltersPanel,
  ResultItem,
  useSearchGlobalQuery,
  EMPTY_TASK_FILTERS,
  hasActiveTaskFilters,
} from "@/features/search";
import type { SearchEntityType, SearchResults, SearchTaskFilters } from "@/features/search";

const PREVIEW_LIMIT = 6;
const PAGE_SIZE = 20;

type InitialQuery = {
  q?: string;
  type?: string;
  assigneeId?: string;
  reporterId?: string;
  done?: string;
  label?: string;
  sprintId?: string;
  updatedFrom?: string;
  updatedTo?: string;
};

const VALID_TYPES: SearchEntityType[] = ["task", "comment", "attachment", "member", "sprint", "column"];

function parseInitialType(value?: string): SearchEntityType | undefined {
  return VALID_TYPES.includes(value as SearchEntityType) ? (value as SearchEntityType) : undefined;
}

const GROUP_LABELS: Record<keyof SearchResults, string> = {
  tasks: "Tasks",
  comments: "Comments",
  attachments: "Attachments",
  members: "Members",
  sprints: "Sprints",
  columns: "Columns",
};

const TYPE_TO_GROUP: Record<SearchEntityType, keyof SearchResults> = {
  task: "tasks",
  comment: "comments",
  attachment: "attachments",
  member: "members",
  sprint: "sprints",
  column: "columns",
};

const GROUP_TO_TYPE: Record<keyof SearchResults, SearchEntityType> = {
  tasks: "task",
  comments: "comment",
  attachments: "attachment",
  members: "member",
  sprints: "sprint",
  columns: "column",
};

interface GlobalSearchViewProps {
  initialQuery: InitialQuery;
}

export function GlobalSearchView({ initialQuery }: GlobalSearchViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery.q ?? "");
  const [type, setType] = useState<SearchEntityType | undefined>(parseInitialType(initialQuery.type));
  const [filters, setFilters] = useState<SearchTaskFilters>({
    assigneeId: initialQuery.assigneeId,
    reporterId: initialQuery.reporterId,
    done: initialQuery.done === undefined ? undefined : initialQuery.done === "true",
    label: initialQuery.label,
    sprintId: initialQuery.sprintId,
    updatedFrom: initialQuery.updatedFrom,
    updatedTo: initialQuery.updatedTo,
    ...EMPTY_TASK_FILTERS,
  });
  const [offset, setOffset] = useState(0);
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  // search.md #6: q không bắt buộc — vẫn search khi có ít nhất 1 filter dù ô
  // trống (browse/filter-only), chỉ thật sự bỏ qua khi cả 2 đều trống.
  const isEmptySearch = debouncedQuery.length === 0 && !hasActiveTaskFilters(filters);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset trang khi đổi điều kiện tìm kiếm
    setOffset(0);
  }, [debouncedQuery, type, filters]);

  const limit = type ? PAGE_SIZE : PREVIEW_LIMIT;
  const { data, isFetching } = useSearchGlobalQuery(
    { q: debouncedQuery, type, limit, offset, ...filters },
    { skip: isEmptySearch },
  );

  const showFiltersPanel = type === undefined || type === "task";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border/60 p-4">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/dashboard" />}>
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div className="relative max-w-xl flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search across all your workspaces..."
            className="pl-9"
            autoFocus
          />
        </div>
      </div>

      <SearchTypeTabs value={type} onChange={setType} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {isEmptySearch ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nhập từ khóa hoặc chọn bộ lọc bên phải để tìm kiếm trong tất cả Workspace của bạn.
            </p>
          ) : isFetching && offset === 0 ? (
            <div className="flex flex-col gap-2">
              <div className="h-10 animate-pulse rounded-md bg-muted/50" />
              <div className="h-10 animate-pulse rounded-md bg-muted/50" />
              <div className="h-10 animate-pulse rounded-md bg-muted/50" />
            </div>
          ) : (
            <SearchResultSections
              results={data}
              type={type}
              onPickType={(nextType) => setType(nextType)}
              onSelectItem={(workspaceId, taskId) =>
                router.push(
                  taskId ? `/workspaces/${workspaceId}?taskId=${taskId}` : `/workspaces/${workspaceId}`,
                )
              }
            />
          )}

          {type && data && (data[TYPE_TO_GROUP[type]]?.length ?? 0) === PAGE_SIZE ? (
            <div className="mt-3 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
              >
                {isFetching ? "Loading..." : "Load more"}
              </Button>
            </div>
          ) : null}
        </div>

        {showFiltersPanel ? <SearchFiltersPanel filters={filters} onChange={setFilters} /> : null}
      </div>
    </div>
  );
}

function SearchResultSections({
  results,
  type,
  onPickType,
  onSelectItem,
}: {
  results: SearchResults | undefined;
  type: SearchEntityType | undefined;
  onPickType: (type: SearchEntityType) => void;
  onSelectItem: (workspaceId: string, taskId?: string) => void;
}) {
  if (!results) return null;

  const groupKeys = type ? [TYPE_TO_GROUP[type]] : (Object.keys(GROUP_LABELS) as (keyof SearchResults)[]);
  const hasAnyResult = groupKeys.some((key) => results[key].length > 0);

  if (!hasAnyResult) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Không tìm thấy kết quả.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {groupKeys.map((key) => {
        const items = results[key];
        if (items.length === 0) return null;
        const entityType = GROUP_TO_TYPE[key];
        return (
          <div key={key}>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{GROUP_LABELS[key]}</p>
              {!type && items.length === PREVIEW_LIMIT ? (
                <button
                  type="button"
                  onClick={() => onPickType(entityType)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  See all {GROUP_LABELS[key].toLowerCase()}
                </button>
              ) : null}
            </div>
            <div className="rounded-lg border border-border/60">
              {items.map((item) => (
                <SectionRow key={item.id} item={item} onSelect={onSelectItem} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionRow({
  item,
  onSelect,
}: {
  item: SearchResults[keyof SearchResults][number];
  onSelect: (workspaceId: string, taskId?: string) => void;
}) {
  const title =
    "title" in item ? item.title : "content" in item ? item.content : "fileName" in item ? item.fileName : "name" in item ? item.name : "";
  const subtitle =
    "status" in item ? item.status : "email" in item ? item.email : "mimeType" in item ? item.mimeType : "";
  // Comment/Attachment deep-link qua đúng Task cha (field taskId); bản thân
  // Task result thì item.id chính là taskId (nhận diện qua field columnId
  // chỉ TaskSearchResult mới có) — Member/Sprint/Column không có deep-link.
  const taskId = "taskId" in item ? item.taskId : "columnId" in item ? item.id : undefined;
  return (
    <ResultItem
      title={title}
      subtitle={subtitle}
      workspaceName={item.workspace.name}
      onSelect={() => onSelect(item.workspace.id, taskId)}
    />
  );
}
