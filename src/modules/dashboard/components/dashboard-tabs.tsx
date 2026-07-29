"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { useListMyTasksQuery, type Task } from "@/features/task";
import { useListMyWorkspacesQuery, type WorkspaceSummary } from "@/features/workspace";
import { WorkspaceCard } from "./workspace-card";
import { TaskListItem } from "./task-list-item";

interface MiniWorkspace {
  id: string;
  name: string;
}

function dedupeWorkspacesFromTasks(tasks: Task[]): MiniWorkspace[] {
  const map = new Map<string, MiniWorkspace>();
  for (const task of tasks) {
    if (!map.has(task.workspaceId)) {
      map.set(task.workspaceId, { id: task.workspaceId, name: task.workspaceName });
    }
  }
  return Array.from(map.values());
}

function TabPanel({
  workspaces,
  tasks,
  isLoading,
  emptyMessage,
}: {
  workspaces: (MiniWorkspace | WorkspaceSummary)[];
  tasks: Task[];
  isLoading: boolean;
  emptyMessage: string;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 py-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-xl border border-border/60 bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (workspaces.length === 0 && tasks.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-2">
      {workspaces.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Workspaces
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        </div>
      ) : null}

      {tasks.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Tasks
          </p>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <TaskListItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface TabDef {
  value: string;
  label: string;
  count: number;
}

export function DashboardTabs() {
  const assigned = useListMyTasksQuery({ scope: "assignee" });
  const starredTasks = useListMyTasksQuery({ starred: true });
  const starredWorkspaces = useListMyWorkspacesQuery({ starred: true });
  const workedOn = useListMyTasksQuery({ scope: "assignee-or-creator" });
  const unfinished = useListMyTasksQuery({ done: false });

  const tabs: TabDef[] = [
    { value: "assigned", label: "Assigned to me", count: assigned.data?.length ?? 0 },
    {
      value: "starred",
      label: "Starred",
      count: (starredTasks.data?.length ?? 0) + (starredWorkspaces.data?.length ?? 0),
    },
    { value: "worked-on", label: "Worked on", count: workedOn.data?.length ?? 0 },
    { value: "unfinished", label: "Unfinished", count: unfinished.data?.length ?? 0 },
  ];

  return (
    <Tabs defaultValue="assigned">
      <TabsList className="h-auto gap-0.5 rounded-full bg-muted p-1 dark:bg-[#545454]">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="gap-1.5 rounded-full px-3.5 py-1.5 data-active:shadow-sm"
          >
            {tab.label}
            {tab.count > 0 ? (
              <Badge className="rounded-full px-1.5">{tab.count}</Badge>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="assigned">
        <TabPanel
          workspaces={dedupeWorkspacesFromTasks(assigned.data ?? [])}
          tasks={assigned.data ?? []}
          isLoading={assigned.isLoading}
          emptyMessage="You don't have any tasks assigned yet."
        />
      </TabsContent>

      <TabsContent value="starred">
        <TabPanel
          workspaces={starredWorkspaces.data ?? []}
          tasks={starredTasks.data ?? []}
          isLoading={starredTasks.isLoading || starredWorkspaces.isLoading}
          emptyMessage="You haven't starred any workspace or task yet."
        />
      </TabsContent>

      <TabsContent value="worked-on">
        <TabPanel
          workspaces={dedupeWorkspacesFromTasks(workedOn.data ?? [])}
          tasks={workedOn.data ?? []}
          isLoading={workedOn.isLoading}
          emptyMessage="No recent activity yet."
        />
      </TabsContent>

      <TabsContent value="unfinished">
        <TabPanel
          workspaces={dedupeWorkspacesFromTasks(unfinished.data ?? [])}
          tasks={unfinished.data ?? []}
          isLoading={unfinished.isLoading}
          emptyMessage="No unfinished tasks. 🎉"
        />
      </TabsContent>
    </Tabs>
  );
}
