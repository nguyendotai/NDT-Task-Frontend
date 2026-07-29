import {
  BellIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboardIcon, label: "Summary" },
  { icon: ClipboardListIcon, label: "Board", active: true },
  { icon: ListIcon, label: "List" },
  { icon: ClipboardListIcon, label: "Backlog" },
  { icon: CalendarIcon, label: "Calendar" },
  { icon: SettingsIcon, label: "Settings" },
];

const STATS = [
  { label: "Completed", value: "24" },
  { label: "Updated", value: "86" },
  { label: "Created", value: "31" },
  { label: "Due Soon", value: "12" },
];

const COLUMNS = [
  {
    name: "To Do",
    tasks: [
      { title: "Design workspace permission matrix", priority: "High" },
      { title: "Connect sprint board with activity feed", priority: "Medium" },
    ],
  },
  {
    name: "In Progress",
    tasks: [
      { title: "Design workspace permission matrix", priority: "High" },
      { title: "Connect sprint board with activity feed", priority: "Medium" },
    ],
  },
  {
    name: "Review",
    tasks: [{ title: "QA notification preferences", priority: "Low" }],
  },
];

const PRIORITY_STYLE: Record<string, string> = {
  High: "bg-red-500/15 text-red-500",
  Medium: "bg-amber-500/15 text-amber-500",
  Low: "bg-emerald-500/15 text-emerald-500",
};

export function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-2xl shadow-blue-500/10 ring-1 ring-foreground/5 backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-yellow-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-muted-foreground">
          Workspace / Product Delivery / Sprint 24
        </span>
      </div>

      <div className="flex text-left">
        <aside className="hidden w-40 shrink-0 flex-col gap-1 border-r border-border/60 p-3 sm:flex">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.label}
              className={
                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium " +
                (item.active
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                  : "text-muted-foreground")
              }
            >
              <item.icon className="size-3.5" />
              {item.label}
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1 p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-background/80 px-3 py-2">
                <p className="font-heading text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.name} className="rounded-lg bg-background/80 p-2.5">
                <p className="mb-2 flex items-center justify-between text-xs font-semibold">
                  {column.name}
                  <span className="text-muted-foreground">{column.tasks.length}</span>
                </p>
                <div className="flex flex-col gap-2">
                  {column.tasks.map((task) => (
                    <div
                      key={task.title}
                      className="rounded-md border border-border/60 bg-card p-2"
                    >
                      <p className="line-clamp-2 text-[11px] font-medium">{task.title}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span
                          className={
                            "rounded px-1.5 py-0.5 text-[9px] font-semibold " +
                            PRIORITY_STYLE[task.priority]
                          }
                        >
                          {task.priority}
                        </span>
                        <span className="size-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-background/80 p-3">
              <div
                className="size-12 shrink-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#3B82F6 0% 42%, #8B5CF6 42% 70%, rgba(120,120,140,0.25) 70% 100%)",
                }}
              />
              <div>
                <p className="text-[11px] font-semibold">Status overview</p>
                <p className="text-[10px] text-muted-foreground">42 work items</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/80 p-3">
              <BellIcon className="size-4 text-blue-500" />
              <div>
                <p className="text-[11px] font-semibold">3 mentions today</p>
                <p className="text-[10px] text-muted-foreground">Stay in sync realtime</p>
              </div>
              <CheckCircle2Icon className="ml-auto size-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
