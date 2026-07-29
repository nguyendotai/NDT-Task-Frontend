import { CheckIcon } from "lucide-react";

const CHECKLIST = ["Workspace Hub", "Board thực thi", "Task Detail Panel", "Member Presence"];

export function ProductPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-violet-500">PRODUCT PREVIEW</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            See workspaces, boards, task detail, comments, and members together.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Giao diện được thiết kế theo đúng nhịp làm việc thực tế: xem nhanh trạng
            thái, sở hữu Task rõ ràng, thảo luận theo ngữ cảnh và theo dõi sức khoẻ dự
            án minh bạch.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {CHECKLIST.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <CheckIcon className="size-3.5 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-xl shadow-blue-500/5 ring-1 ring-foreground/5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-background/80 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">Mobile App Release</p>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-500">
                  On Track
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {["Authentication", "Sprint Planning", "QA Review", "Release Notes"].map((row) => (
                  <div key={row} className="rounded-lg bg-card px-2 py-1.5 text-[10px] text-muted-foreground">
                    {row}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-background/80 p-3">
              <p className="text-xs font-semibold">Task Detail</p>
              <p className="mt-1 text-[11px] font-medium text-blue-500">
                Implement role permission matrix
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  "Assignee: minh nguyen",
                  "Attached: link spec",
                  "QA moved to review",
                ].map((row) => (
                  <div key={row} className="rounded-md bg-card px-2 py-1.5 text-[10px] text-muted-foreground">
                    {row}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
