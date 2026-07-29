import {
  BellIcon,
  KanbanSquareIcon,
  ListChecksIcon,
  MessageSquareIcon,
  PaperclipIcon,
  TagIcon,
  TimerIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const FEATURES = [
  {
    icon: UsersIcon,
    title: "Workspace Management",
    description:
      "Tạo nhiều Workspace cho từng team/dự án, quản lý thành viên và phân quyền rõ ràng.",
  },
  {
    icon: KanbanSquareIcon,
    title: "Kanban Board",
    description: "Kéo thả trực quan giữa các Column, theo dõi trạng thái công việc theo thời gian thực.",
  },
  {
    icon: TimerIcon,
    title: "Scrum Board",
    description: "Quản lý Product Backlog, lập kế hoạch Sprint theo đúng quy trình Scrum.",
  },
  {
    icon: ListChecksIcon,
    title: "Sprint Management",
    description: "Tạo, bắt đầu và hoàn thành Sprint, theo dõi tiến độ với báo cáo Burndown/Velocity.",
  },
  {
    icon: UserPlusIcon,
    title: "Task Assignment",
    description: "Giao việc cho thành viên phù hợp, đặt deadline và theo dõi trách nhiệm rõ ràng.",
  },
  {
    icon: TagIcon,
    title: "Labels & Priorities",
    description: "Gắn nhãn, đặt độ ưu tiên (Low/Medium/High) để sắp xếp công việc khoa học.",
  },
  {
    icon: MessageSquareIcon,
    title: "Comments & Attachments",
    description: "Thảo luận trực tiếp trên Task, đính kèm file/hình ảnh liên quan.",
  },
  {
    icon: PaperclipIcon,
    title: "Activity Log",
    description: "Ghi lại toàn bộ lịch sử thao tác, minh bạch và dễ dàng truy vết thay đổi.",
  },
  {
    icon: BellIcon,
    title: "Notifications",
    description: "Nhận thông báo thời gian thực khi được giao việc, có comment hoặc cập nhật task.",
  },
];

export function CoreFeatures() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Everything your team needs
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Đầy đủ công cụ để quản lý công việc từ Workspace đến từng Task chi tiết.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border/60">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-blue-500">
                <feature.icon className="size-5" />
              </div>
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
