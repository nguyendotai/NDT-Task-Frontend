"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { useDebouncedValue } from "@/shared/hooks/use-debounce";
import { useSearchQuery } from "../api/search.api";
import { EMPTY_TASK_FILTERS } from "../types/search.types";
import type { SearchEntityType, SearchResults, SearchTaskFilters } from "../types/search.types";
import { SearchTypeTabs } from "./search-type-tabs";
import { SearchFiltersPanel } from "./search-filters-panel";
import { SearchResultGroups } from "./search-result-groups";
import { SearchRecentPanel } from "./search-recent-panel";
import { buildAdvancedSearchUrl } from "../utils/build-search-url";

const QUICK_SEARCH_LIMIT = 5;

interface SearchBoxProps {
  workspaceId?: string;
}

export function SearchBox({ workspaceId }: SearchBoxProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<SearchEntityType | undefined>(undefined);
  const [taskFilters, setTaskFilters] = useState<SearchTaskFilters>(EMPTY_TASK_FILTERS);
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const { data, isFetching } = useSearchQuery(
    {
      workspaceId: workspaceId ?? "",
      q: debouncedQuery,
      type,
      limit: QUICK_SEARCH_LIMIT,
      ...taskFilters,
    },
    { skip: !workspaceId || debouncedQuery.length === 0 },
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

  const goToWorkspace = () => {
    if (!workspaceId) return;
    router.push(`/workspaces/${workspaceId}`);
    closeAndReset();
  };

  const goToAdvancedSearch = () => {
    if (!workspaceId) return;
    router.push(buildAdvancedSearchUrl(workspaceId, debouncedQuery, type, taskFilters));
    closeAndReset();
  };

  const showFiltersPanel = !!workspaceId && (type === undefined || type === "task");
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
        disabled={!workspaceId}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
            event.currentTarget.blur();
          }
        }}
        placeholder={workspaceId ? "Search tasks, comments, members..." : "Open a workspace to search"}
        className="pl-9"
      />

      {isOpen && workspaceId ? (
        <div className="absolute top-full left-0 z-50 mt-2 w-[640px] max-w-[92vw] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md">
          <SearchTypeTabs value={type} onChange={setType} />

          <div className="flex max-h-96">
            <div className="flex-1 overflow-y-auto p-1">
              {debouncedQuery.length === 0 ? (
                <SearchRecentPanel workspaceId={workspaceId} onSelect={closeAndReset} />
              ) : isFetching ? (
                <div className="flex flex-col gap-2 p-2">
                  <div className="h-8 animate-pulse rounded-md bg-muted/50" />
                  <div className="h-8 animate-pulse rounded-md bg-muted/50" />
                  <div className="h-8 animate-pulse rounded-md bg-muted/50" />
                </div>
              ) : !hasResults ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results found for &ldquo;{debouncedQuery}&rdquo;.
                </p>
              ) : (
                <SearchResultGroups
                  results={data as SearchResults}
                  activeType={type}
                  onSelect={goToWorkspace}
                />
              )}
            </div>
            {showFiltersPanel ? (
              <SearchFiltersPanel
                workspaceId={workspaceId}
                filters={taskFilters}
                onChange={setTaskFilters}
              />
            ) : null}
          </div>

          {debouncedQuery.length > 0 ? (
            <button
              type="button"
              onClick={goToAdvancedSearch}
              className="block w-full border-t border-border/60 px-3 py-2 text-center text-xs font-medium text-primary hover:bg-muted"
            >
              View all results
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
