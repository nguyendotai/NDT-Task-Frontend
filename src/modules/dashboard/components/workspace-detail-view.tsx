"use client";

import Link from "next/link";
import { ArrowLeftIcon, GlobeIcon, LockIcon, SettingsIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { getWorkspaceAvatarGradient, useGetWorkspaceQuery } from "@/features/workspace";
import { BoardView } from "@/modules/board/components/board-view";
import { ListView } from "@/modules/board/components/list-view";
import { MemberView } from "@/modules/board/components/member-view";
import { TimelineView } from "@/modules/board/components/timeline-view";
import { CalendarView } from "@/modules/board/components/calendar-view";
import { ArchiveView } from "@/modules/board/components/archive-view";
import { DocsView } from "@/modules/board/components/docs-view";
import { SprintView } from "@/modules/board/components/sprint-view";

const TABS = [
  { value: "list", label: "List" },
  { value: "timeline", label: "Timeline" },
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
  { value: "archive", label: "Archive" },
  { value: "member", label: "Member" },
  { value: "docs", label: "Docs" },
] as const;

// sprint.md: Sprint chỉ tồn tại trong Workspace loại Scrum — tab riêng, chèn
// ngay sau Board để gần với luồng làm việc chính.
const SPRINT_TAB = { value: "sprint", label: "Sprint" } as const;

export function WorkspaceDetailView({ workspaceId }: { workspaceId: string }) {
  const {
    data: workspace,
    isLoading,
    isError,
    refetch,
  } = useGetWorkspaceQuery(workspaceId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted/50" />
        <div className="h-24 animate-pulse rounded-2xl border border-border/60 bg-muted/50" />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Workspace not found, or you don&apos;t have access to it.{" "}
        <button
          type="button"
          onClick={() => refetch()}
          className="font-medium text-foreground underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  const isScrum = workspace.type === "SCRUM";
  const tabs = isScrum
    ? [...TABS.slice(0, 3), SPRINT_TAB, ...TABS.slice(3)]
    : TABS;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/workspaces"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to workspaces
      </Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-sm ${getWorkspaceAvatarGradient(
              workspace.avatarColor,
            )}`}
          >
            {workspace.avatarEmoji}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-bold">{workspace.name}</h1>
              <Badge className="border-transparent bg-gradient-to-r from-blue-500 to-violet-500 text-white">
                {workspace.type}
              </Badge>
              <Badge variant={workspace.visibility === "PUBLIC" ? "secondary" : "outline"}>
                {workspace.visibility === "PUBLIC" ? (
                  <GlobeIcon className="size-3" />
                ) : (
                  <LockIcon className="size-3" />
                )}
                {workspace.visibility === "PUBLIC" ? "Public" : "Private"}
              </Badge>
            </div>
            {workspace.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{workspace.description}</p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              {workspace.membersCount} member{workspace.membersCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 self-start sm:self-center"
          nativeButton={false}
          render={<Link href={`/workspaces/${workspaceId}/settings`} />}
        >
          <SettingsIcon className="size-3.5" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="board">
        <TabsList className="h-auto flex-wrap gap-0.5 rounded-full bg-muted p-1 dark:bg-[#545454]">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full px-3.5 py-1.5 data-active:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <ListView workspaceId={workspaceId} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <TimelineView workspaceId={workspaceId} />
        </TabsContent>
        <TabsContent value="board" className="mt-4">
          <BoardView workspaceId={workspaceId} isScrum={isScrum} />
        </TabsContent>
        {isScrum ? (
          <TabsContent value="sprint" className="mt-4">
            <SprintView workspaceId={workspaceId} />
          </TabsContent>
        ) : null}
        <TabsContent value="calendar" className="mt-4">
          <CalendarView workspaceId={workspaceId} />
        </TabsContent>
        <TabsContent value="archive" className="mt-4">
          <ArchiveView workspaceId={workspaceId} />
        </TabsContent>
        <TabsContent value="member" className="mt-4">
          <MemberView workspaceId={workspaceId} />
        </TabsContent>
        <TabsContent value="docs" className="mt-4">
          <DocsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
