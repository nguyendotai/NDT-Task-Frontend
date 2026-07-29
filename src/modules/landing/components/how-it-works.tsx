const STEPS = [
  {
    title: "Create Workspace",
    description: "Thiết lập dự án, team, trạng thái và cấu trúc phân phối.",
  },
  {
    title: "Invite Team",
    description: "Mời developer, product manager, agency hoặc stakeholder vào cùng một luồng.",
  },
  {
    title: "Create Board",
    description: "Board Kanban/Scrum tự động sinh sẵn theo loại Workspace.",
  },
  {
    title: "Add Tasks",
    description: "Chia nhỏ công việc thành Task có priority, assignee và deadline.",
  },
  {
    title: "Track Progress",
    description: "Dùng Board, Activity Log và báo cáo để theo dõi tiến độ minh bạch.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-blue-500">HOW IT WORKS</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            From empty workspace to visible delivery in five steps.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Quy trình đủ đơn giản cho startup, đủ chặt chẽ cho team enterprise.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-xl border border-border/60 bg-card/60 p-5"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-foreground font-heading text-sm font-bold text-background">
                {index + 1}
              </div>
              <p className="mt-4 font-medium">{step.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
