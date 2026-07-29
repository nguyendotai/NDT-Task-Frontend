import { ArrowRightIcon } from "lucide-react";

const STEPS = [
  { title: "Create Workspace" },
  { title: "Invite Team" },
  { title: "Create Board" },
  { title: "Add Tasks" },
  { title: "Track Progress" },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Bắt đầu sử dụng NDT Task chỉ trong 5 bước đơn giản.
          </p>
        </div>

        <div className="mt-14 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex flex-1 items-center gap-4 md:flex-col md:gap-3 md:text-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 font-heading text-base font-semibold text-white">
                {index + 1}
              </div>
              <p className="font-medium">{step.title}</p>
              {index < STEPS.length - 1 ? (
                <ArrowRightIcon className="ml-auto hidden size-5 shrink-0 text-muted-foreground md:ml-0 md:block" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
