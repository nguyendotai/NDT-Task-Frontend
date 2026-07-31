"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquareIcon,
  Columns3Icon,
  MessageSquareIcon,
  PaperclipIcon,
  SearchIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { useDebouncedValue } from "@/shared/hooks/use-debounce";
import { useSearchQuery } from "../api/search.api";
import type { SearchResults } from "../types/search.types";

const QUICK_SEARCH_LIMIT = 5;

interface SearchBoxProps {
  workspaceId?: string;
}

export function SearchBox({ workspaceId }: SearchBoxProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const { data, isFetching } = useSearchQuery(
    { workspaceId: workspaceId ?? "", q: debouncedQuery, limit: QUICK_SEARCH_LIMIT },
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

  const goToWorkspace = () => {
    if (!workspaceId) return;
    router.push(`/workspaces/${workspaceId}`);
    setIsOpen(false);
    setQuery("");
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
        <div className="absolute top-full left-0 z-50 mt-2 max-h-96 w-full min-w-72 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md">
          {debouncedQuery.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Type to search tasks, comments, attachments, members, sprints...
            </p>
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
            <SearchResultGroups results={data as SearchResults} onSelect={goToWorkspace} />
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchResultGroups({
  results,
  onSelect,
}: {
  results: SearchResults;
  onSelect: () => void;
}) {
  return (
    <>
      <ResultGroup label="Tasks" icon={CheckSquareIcon}>
        {results.tasks.map((task) => (
          <ResultItem key={task.id} onSelect={onSelect} title={task.title} subtitle={task.status} />
        ))}
      </ResultGroup>
      <ResultGroup label="Comments" icon={MessageSquareIcon}>
        {results.comments.map((comment) => (
          <ResultItem key={comment.id} onSelect={onSelect} title={comment.content} subtitle="Comment" />
        ))}
      </ResultGroup>
      <ResultGroup label="Attachments" icon={PaperclipIcon}>
        {results.attachments.map((attachment) => (
          <ResultItem key={attachment.id} onSelect={onSelect} title={attachment.fileName} subtitle={attachment.mimeType} />
        ))}
      </ResultGroup>
      <ResultGroup label="Members" icon={UserIcon}>
        {results.members.map((member) => (
          <ResultItem key={member.id} onSelect={onSelect} title={member.name} subtitle={member.email} />
        ))}
      </ResultGroup>
      <ResultGroup label="Sprints" icon={ZapIcon}>
        {results.sprints.map((sprint) => (
          <ResultItem key={sprint.id} onSelect={onSelect} title={sprint.name} subtitle={sprint.status} />
        ))}
      </ResultGroup>
      <ResultGroup label="Columns" icon={Columns3Icon}>
        {results.columns.map((column) => (
          <ResultItem key={column.id} onSelect={onSelect} title={column.name} subtitle="Column" />
        ))}
      </ResultGroup>
    </>
  );
}

function ResultGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof SearchIcon;
  children: React.ReactNode;
}) {
  const items = children as React.ReactNode[];
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="mb-1 last:mb-0">
      <p className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </p>
      {children}
    </div>
  );
}

function ResultItem({
  title,
  subtitle,
  onSelect,
}: {
  title: string;
  subtitle: string;
  onSelect: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className="flex w-full cursor-pointer flex-col rounded-md px-2 py-1.5 text-left hover:bg-accent"
    >
      <span className="truncate text-sm text-foreground">{title}</span>
      <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
    </div>
  );
}
