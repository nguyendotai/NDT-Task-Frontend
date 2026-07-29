const SEGMENTS = [
  "Startup Teams",
  "Agencies",
  "Developers",
  "Product Teams",
  "Enterprise Teams",
];

export function TrustedBy() {
  return (
    <section className="border-y border-border/60 bg-muted/20 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground">
          PHÙ HỢP CHO
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {SEGMENTS.map((segment) => (
            <span
              key={segment}
              className="rounded-full border border-border/60 px-4 py-1.5 text-sm text-muted-foreground"
            >
              {segment}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
