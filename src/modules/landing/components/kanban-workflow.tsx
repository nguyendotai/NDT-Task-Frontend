const COLUMNS = [
  {
    name: "To Do",
    accent: "text-muted-foreground",
    tasks: [
      { title: "Define workspace roles", meta: "Priority: P1" },
      { title: "Create onboarding checklist", meta: "Priority: P2" },
    ],
  },
  {
    name: "In Progress",
    accent: "text-blue-500",
    tasks: [
      { title: "Sprint board API", meta: "Priority: P1" },
      { title: "Notification preferences", meta: "Priority: P2" },
    ],
  },
  {
    name: "Review",
    accent: "text-amber-500",
    tasks: [
      { title: "Kanban drag states", meta: "Priority: P2" },
      { title: "Activity feed filters", meta: "Priority: P3" },
    ],
  },
  {
    name: "Done",
    accent: "text-emerald-500",
    tasks: [
      { title: "Workspace dashboard", meta: "Priority: P2" },
      { title: "Member invite flow", meta: "Priority: P3" },
    ],
  },
];

export function KanbanWorkflow() {
  return (
    <section className="border-y border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-blue-500">KANBAN WORKFLOW</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            A real board view for todo, progress, review, and done.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cho team một hệ quy chiếu trực quan để thực thi, review chất lượng và
            chịu trách nhiệm rõ ràng.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.name} className="rounded-xl border border-border/60 bg-card/60 p-3">
              <p className={`mb-3 flex items-center justify-between text-xs font-semibold ${column.accent}`}>
                {column.name}
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  {column.tasks.length}
                </span>
              </p>
              <div className="flex flex-col gap-2">
                {column.tasks.map((task) => (
                  <div key={task.title} className="rounded-lg border border-border/60 bg-background/80 p-2.5">
                    <p className="text-xs font-medium">{task.title}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{task.meta}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
