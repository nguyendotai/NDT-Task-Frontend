"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { useDebouncedValue } from "@/shared/hooks/use-debounce";
import { useSearchGlobalQuery } from "../api/search.api";
import { EMPTY_TASK_FILTERS, hasActiveTaskFilters } from "../types/search.types";
import type { SearchResults, SearchTaskFilters } from "../types/search.types";
import { SearchFiltersPanel } from "./search-filters-panel";
import { SearchResultGroups } from "./search-result-groups";
import { SearchRecentPanel } from "./search-recent-panel";
import { buildGlobalSearchUrl } from "../utils/build-search-url";

const QUICK_SEARCH_LIMIT = 5;

interface SearchBoxProps {
  // Chỉ dùng để quyết định có hiện Assignee/Sprint/Label (cần đúng 1
  // Workspace mới có ý nghĩa) hay không — bản thân ô search luôn hoạt động
  // ở bất cứ đâu, tìm xuyên suốt tất cả Workspace của user (Global Search).
  workspaceId?: string;
}

export function SearchBox({ workspaceId }: SearchBoxProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [taskFilters, setTaskFilters] = useState<SearchTaskFilters>(EMPTY_TASK_FILTERS);
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  // search.md #6: q không bắt buộc — vẫn search khi có ít nhất 1 filter dù ô
  // trống (browse/filter-only), chỉ thật sự bỏ qua khi cả 2 đều trống.
  const isEmptySearch = debouncedQuery.length === 0 && !hasActiveTaskFilters(taskFilters);

  const { data, isFetching } = useSearchGlobalQuery(
    { q: debouncedQuery, limit: QUICK_SEARCH_LIMIT, ...taskFilters },
    { skip: isEmptySearch },
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAndReset = () => {
    setIsOpen(false);
    setQuery("");
  };

  const goToResultWorkspace = (targetWorkspaceId: string) => {
    router.push(`/workspaces/${targetWorkspaceId}`);
    closeAndReset();
  };

  const goToGlobalSearch = () => {
    router.push(buildGlobalSearchUrl(debouncedQuery, taskFilters));
    closeAndReset();
  };

  const hasResults =
    !!data &&
    (data.tasks.length > 0 ||
      data.comments.length > 0 ||
      data.attachments.length > 0 ||
      data.members.length > 0 ||
      data.sprints.length > 0 ||
      data.columns.length > 0);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
            event.currentTarget.blur();
          }
        }}
        placeholder="Search across all your workspaces..."
        className="pl-9"
      />

      {isOpen ? (
        <div className="absolute top-full left-0 z-50 mt-2 w-[640px] max-w-[92vw] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md">
          <div className="flex max-h-96">
            <div className="flex-1 overflow-y-auto p-1">
              {isEmptySearch ? (
                <SearchRecentPanel workspaceId={workspaceId} onSelect={closeAndReset} />
              ) : isFetching ? (
                <div className="flex flex-col gap-2 p-2">
                  <div className="h-8 animate-pulse rounded-md bg-muted/50" />
                  <div className="h-8 animate-pulse rounded-md bg-muted/50" />
                  <div className="h-8 animate-pulse rounded-md bg-muted/50" />
                </div>
              ) : !hasResults ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {debouncedQuery.length > 0
                    ? <>No results found for &ldquo;{debouncedQuery}&rdquo;.</>
                    : "No results match the selected filters."}
                </p>
              ) : (
                <SearchResultGroups
                  results={data as SearchResults}
                  activeType={undefined}
                  onSelect={(workspace) => goToResultWorkspace(workspace.id)}
                />
              )}
            </div>
            <SearchFiltersPanel workspaceId={workspaceId} filters={taskFilters} onChange={setTaskFilters} />
          </div>

          <button
            type="button"
            onClick={goToGlobalSearch}
            className="flex w-full items-center justify-between border-t border-border/60 px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <SearchIcon className="size-3.5" />
              View all work items
            </span>
            <ArrowRightIcon className="size-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
