import { AtSignIcon, ListTodoIcon, MessageCircleIcon, ActivityIcon } from "lucide-react";

const COLLAB_ITEMS = [
  {
    icon: ListTodoIcon,
    title: "Assign Tasks",
    description: "Giao việc rõ ràng cho assignee, reviewer, due date và trạng thái.",
  },
  {
    icon: MessageCircleIcon,
    title: "Comments",
    description: "Thảo luận chi tiết triển khai ngay tại nơi công việc diễn ra.",
  },
  {
    icon: AtSignIcon,
    title: "Mentions",
    description: "Kéo đồng đội vào quyết định mà không mất ngữ cảnh.",
  },
  {
    icon: ActivityIcon,
    title: "Activity Log",
    description: "Ghi lại mọi cập nhật, di chuyển thao tác xuyên suốt Workspace.",
  },
];

const STATS = [
  { label: "Completion", value: "84%" },
  { label: "Team productivity", value: "+18%" },
  { label: "Cycle time", value: "3.4d" },
  { label: "Blocked tasks", value: "06" },
];

const BURNDOWN_BARS = [80, 68, 58, 46, 34, 24, 14];

export function CollaborationProgress() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <p className="text-sm font-semibold tracking-widest text-emerald-500">COLLABORATION</p>
          <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight">
            Assign, comment, mention, and track every team activity.
          </h3>
          <div className="mt-6 flex flex-col gap-4">
            {COLLAB_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
                  <item.icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <p className="text-sm font-semibold tracking-widest text-blue-500">PROGRESS TRACKING</p>
          <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight">
            Analytics that show project health, not just activity.
          </h3>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-background/80 p-3">
                <p className="font-heading text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-background/80 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">Sprint burndown</p>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-500">
                Healthy
              </span>
            </div>
            <div className="mt-3 flex h-20 items-end gap-2">
              {BURNDOWN_BARS.map((height, index) => (
                <div
                  key={index}
                  style={{ height: `${height}%` }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-emerald-500"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
