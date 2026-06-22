function SkeletonLine({
  width,
  height = "h-2.5",
  delay = 0,
}: {
  width: string;
  height?: string;
  delay?: number;
}) {
  return (
    <div
      className={`${height} rounded-full template-skeleton`}
      style={{ width, animationDelay: `${delay}ms` }}
    />
  );
}

export function TemplateGenerating() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6 relative overflow-hidden">
      {/* Ambient glow behind the document */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-primary/[0.06] pointer-events-none" />

      {/* Document card */}
      <div className="relative bg-white dark:bg-card rounded-xl border border-border shadow-xl shadow-primary/10 overflow-hidden w-full max-w-sm shrink-0">
        {/* Scanner beam */}
        <div className="template-scan-beam" />

        <div className="p-5 flex flex-col gap-4">
          {/* ── Header row: logo + invoice label ── */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <SkeletonLine width="110px" height="h-4" delay={0} />
              <SkeletonLine width="70px" height="h-2.5" delay={80} />
            </div>
            <SkeletonLine width="68px" height="h-7" delay={160} />
          </div>

          <div className="h-px bg-border" />

          {/* ── Bill-to / meta columns ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <SkeletonLine width="44px" height="h-2" delay={240} />
              <SkeletonLine width="88px" delay={320} />
              <SkeletonLine width="64px" delay={400} />
              <SkeletonLine width="76px" delay={480} />
            </div>
            <div className="flex flex-col gap-1.5">
              <SkeletonLine width="52px" height="h-2" delay={240} />
              <SkeletonLine width="80px" delay={320} />
              <SkeletonLine width="60px" delay={400} />
              <SkeletonLine width="56px" delay={480} />
            </div>
          </div>

          {/* ── Table header ── */}
          <div className="flex gap-2 py-1.5 border-y border-border">
            <SkeletonLine width="44%" height="h-2" delay={560} />
            <SkeletonLine width="14%" height="h-2" delay={600} />
            <SkeletonLine width="16%" height="h-2" delay={640} />
            <SkeletonLine width="14%" height="h-2" delay={680} />
          </div>

          {/* ── Line items ── */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-2 items-center">
              <SkeletonLine
                width={`${54 - i * 8}%`}
                height="h-2.5"
                delay={760 + i * 90}
              />
              <SkeletonLine width="10%" height="h-2.5" delay={780 + i * 90} />
              <SkeletonLine width="12%" height="h-2.5" delay={800 + i * 90} />
              <SkeletonLine width="12%" height="h-2.5" delay={820 + i * 90} />
            </div>
          ))}

          {/* ── Totals block ── */}
          <div className="flex justify-end pt-1">
            <div className="flex flex-col gap-1.5 w-36">
              <div className="flex justify-between">
                <SkeletonLine width="44px" height="h-2" delay={1040} />
                <SkeletonLine width="36px" height="h-2" delay={1040} />
              </div>
              <div className="flex justify-between">
                <SkeletonLine width="28px" height="h-2" delay={1090} />
                <SkeletonLine width="32px" height="h-2" delay={1090} />
              </div>
              <div className="flex justify-between pt-1 border-t border-border">
                <SkeletonLine width="36px" height="h-3" delay={1140} />
                <SkeletonLine width="44px" height="h-3" delay={1140} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground select-none">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex size-full rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <span>Crafting your template</span>
        <span className="flex gap-0.5 text-primary font-bold tracking-widest">
          <span
            className="animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "900ms" }}
          >
            .
          </span>
          <span
            className="animate-bounce"
            style={{ animationDelay: "150ms", animationDuration: "900ms" }}
          >
            .
          </span>
          <span
            className="animate-bounce"
            style={{ animationDelay: "300ms", animationDuration: "900ms" }}
          >
            .
          </span>
        </span>
      </div>
    </div>
  );
}
