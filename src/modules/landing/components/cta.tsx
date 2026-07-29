import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 px-6 py-16 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(255,255,255,0.15),transparent)]"
        />
        <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Start managing your projects today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
          Miễn phí bắt đầu, không cần thẻ tín dụng.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            variant="secondary"
            render={<Link href="/register" />}
            className="h-11 gap-2 px-6"
          >
            Get Started Free
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
