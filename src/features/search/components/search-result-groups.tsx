"use client";

import {
  CheckSquareIcon,
  Columns3Icon,
  MessageSquareIcon,
  PaperclipIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import type { SearchEntityType, SearchResults, WorkspaceRef } from "../types/search.types";

interface SearchResultGroupsProps {
  results: SearchResults;
  activeType: SearchEntityType | undefined;
  // Kết quả có thể thuộc nhiều Workspace khác nhau (Global Search) nên điều
  // hướng phải theo đúng workspace của TỪNG item, không phải 1 workspace cố định.
  onSelect: (workspace: WorkspaceRef) => void;
}

export function SearchResultGroups({ results, activeType, onSelect }: SearchResultGroupsProps) {
  const showAll = !activeType;

  return (
    <>
      {(showAll || activeType === "task") && (
        <ResultGroup label="Tasks" icon={CheckSquareIcon} hideLabel={!showAll}>
          {results.tasks.map((task) => (
            <ResultItem
              key={task.id}
              onSelect={() => onSelect(task.workspace)}
              title={task.title}
              subtitle={task.status}
              workspaceName={task.workspace.name}
            />
          ))}
        </ResultGroup>
      )}
      {(showAll || activeType === "comment") && (
        <ResultGroup label="Comments" icon={MessageSquareIcon} hideLabel={!showAll}>
          {results.comments.map((comment) => (
            <ResultItem
              key={comment.id}
              onSelect={() => onSelect(comment.workspace)}
              title={comment.content}
              subtitle="Comment"
              workspaceName={comment.workspace.name}
            />
          ))}
        </ResultGroup>
      )}
      {(showAll || activeType === "attachment") && (
        <ResultGroup label="Attachments" icon={PaperclipIcon} hideLabel={!showAll}>
          {results.attachments.map((attachment) => (
            <ResultItem
              key={attachment.id}
              onSelect={() => onSelect(attachment.workspace)}
              title={attachment.fileName}
              subtitle={attachment.mimeType}
              workspaceName={attachment.workspace.name}
            />
          ))}
        </ResultGroup>
      )}
      {(showAll || activeType === "member") && (
        <ResultGroup label="Members" icon={UserIcon} hideLabel={!showAll}>
          {results.members.map((member) => (
            <ResultItem
              key={member.id}
              onSelect={() => onSelect(member.workspace)}
              title={member.name}
              subtitle={member.email}
              workspaceName={member.workspace.name}
            />
          ))}
        </ResultGroup>
      )}
      {(showAll || activeType === "sprint") && (
        <ResultGroup label="Sprints" icon={ZapIcon} hideLabel={!showAll}>
          {results.sprints.map((sprint) => (
            <ResultItem
              key={sprint.id}
              onSelect={() => onSelect(sprint.workspace)}
              title={sprint.name}
              subtitle={sprint.status}
              workspaceName={sprint.workspace.name}
            />
          ))}
        </ResultGroup>
      )}
      {(showAll || activeType === "column") && (
        <ResultGroup label="Columns" icon={Columns3Icon} hideLabel={!showAll}>
          {results.columns.map((column) => (
            <ResultItem
              key={column.id}
              onSelect={() => onSelect(column.workspace)}
              title={column.name}
              subtitle="Column"
              workspaceName={column.workspace.name}
            />
          ))}
        </ResultGroup>
      )}
    </>
  );
}

function ResultGroup({
  label,
  icon: Icon,
  hideLabel,
  children,
}: {
  label: string;
  icon: typeof CheckSquareIcon;
  hideLabel: boolean;
  children: React.ReactNode;
}) {
  const items = children as React.ReactNode[];
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="mb-1 last:mb-0">
      {!hideLabel && (
        <p className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground">
          <Icon className="size-3.5" />
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

export function ResultItem({
  title,
  subtitle,
  workspaceName,
  onSelect,
}: {
  title: string;
  subtitle: string;
  workspaceName?: string;
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
      className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left hover:bg-accent"
    >
      <div className="min-w-0">
        <p className="truncate text-sm text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {workspaceName ? (
        <span className="shrink-0 truncate rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {workspaceName}
        </span>
      ) : null}
    </div>
  );
}
