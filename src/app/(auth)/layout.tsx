import Link from "next/link";
import { LayoutGridIcon } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-muted/20 px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 -z-10 size-96 rounded-full bg-violet-500/20 blur-3xl"
      />
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
          <LayoutGridIcon className="size-4.5" />
        </span>
        <span className="font-heading text-lg font-bold">NDT Task</span>
      </Link>
      <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-card/60 p-9 shadow-xl shadow-blue-500/5 backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
