import Link from "next/link";
import { LayoutGridIcon } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
          <LayoutGridIcon className="size-4.5" />
        </span>
        <span className="font-heading text-lg font-bold">NDT Task</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/60 p-8 shadow-xl shadow-blue-500/5 backdrop-blur">
        {children}
      </div>
    </div>
  );
}
