import Link from "next/link";
import { ArrowRightIcon, PlayIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]"
      />
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Manage Tasks with{" "}
          <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            Confidence
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          NDT Task giúp đội nhóm của bạn lên kế hoạch, theo dõi và hoàn thành công
          việc dễ dàng hơn — hỗ trợ cả Kanban và Scrum trong cùng một nền tảng.
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
            Watch Demo
          </Button>
        </div>

        <div className="mt-16 w-full">
          <div className="relative rounded-2xl border border-border/60 bg-card/50 p-2 shadow-2xl shadow-blue-500/10 ring-1 ring-foreground/5 backdrop-blur">
            <div className="flex items-center gap-1.5 px-3 py-2">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
            </div>
            <div className="aspect-16/9 w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/40">
              <div className="grid h-full grid-cols-4 gap-3 p-6">
                <div className="col-span-1 rounded-lg bg-background/80" />
                <div className="col-span-3 grid grid-rows-3 gap-3">
                  <div className="rounded-lg bg-background/80" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20" />
                    <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20" />
                    <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20" />
                  </div>
                  <div className="rounded-lg bg-background/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
