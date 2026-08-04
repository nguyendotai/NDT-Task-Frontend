import {
  CheckCircle2Icon,
  LayersIcon,
  RadarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";

const REASONS = [
  {
    icon: LayersIcon,
    title: "Supports both Kanban & Scrum",
    description: "Chọn phương pháp phù hợp với team — hoặc dùng cả hai cho từng Workspace.",
  },
  {
    icon: SparklesIcon,
    title: "Intuitive interface",
    description: "Giao diện trực quan, dễ làm quen, không cần đào tạo phức tạp.",
  },
  {
    icon: RadarIcon,
    title: "Multi-workspace management",
    description: "Quản lý nhiều dự án/team độc lập trong cùng một tài khoản.",
  },
  {
    icon: ZapIcon,
    title: "Real-time updates",
    description: "Mọi thay đổi được đồng bộ tức thì tới toàn bộ thành viên trong Board.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Member permissions",
    description: "Phân quyền theo vai trò (Owner/Admin/Member) rõ ràng, an toàn.",
  },
  {
    icon: CheckCircle2Icon,
    title: "Progress tracking",
    description: "Theo dõi tiến độ dự án qua báo cáo Burndown, Velocity trực quan.",
  },
];

export function WhyChoose() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-blue-500">WHY NDT TASK</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose NDT Task
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-emerald-500/15 text-blue-500">
                <reason.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-medium">{reason.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
