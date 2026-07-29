import Link from "next/link";
import { ArrowRightIcon, PlayIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { DashboardMockup } from "@/modules/landing/components/dashboard-mockup";

const HIGHLIGHTS = [
  { title: "Kanban & Scrum", description: "Chọn quy trình phù hợp cho từng Workspace" },
  { title: "Realtime Sync", description: "Mọi thay đổi cập nhật tức thì cho cả team" },
  { title: "Multi-Workspace", description: "Quản lý nhiều dự án độc lập, không giới hạn" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]"
      />
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <Badge variant="outline" className="gap-1.5 py-1.5">
          <SparklesIcon className="size-3" />
          Quản lý công việc cho team phát triển sản phẩm hiện đại
        </Badge>

        <h1 className="mt-6 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Plan, build, and ship software
          <br />
          from one{" "}
          <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            premium workspace
          </span>
          .
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          NDT Task giúp đội nhóm lên kế hoạch, theo dõi và hoàn thành công việc dễ
          dàng hơn — hỗ trợ cả Kanban và Scrum trong cùng một nền tảng.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            render={<Link href="/register" />}
            className="h-11 gap-2 bg-gradient-to-r from-blue-500 to-violet-500 px-6 text-white shadow-lg shadow-blue-500/25 hover:opacity-90"
          >
            Get Started Free
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<a href="#screenshots" />}
            className="h-11 gap-2 px-6"
          >
            <PlayIcon className="size-4" />
            View Demo Workspace
          </Button>
        </div>

        <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/60 bg-card/50 px-5 py-4 text-left backdrop-blur"
            >
              <p className="font-heading text-base font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div id="screenshots" className="mt-12 w-full scroll-mt-24">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
