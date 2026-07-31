import Link from "next/link";
import { ArrowRightIcon, Share2Icon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-violet-500/10 px-6 py-16 text-center shadow-2xl shadow-blue-500/10 sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(139,92,246,0.15),transparent)]"
        />
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
          <Share2Icon className="size-5" />
        </span>
        <h2 className="mt-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Start managing your projects today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Chuyển từ Task rời rạc, không rõ trách nhiệm sang một hệ điều hành dự án
          được xây dựng cho phân phối phần mềm.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/register" />}
            className="h-11 gap-2 bg-gradient-to-r from-blue-500 to-violet-500 px-6 text-white hover:opacity-90"
          >
            Get Started Free
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
