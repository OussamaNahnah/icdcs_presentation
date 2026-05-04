import { useEffect, useState } from "react";
import { useSlideController } from "../useSlideController";
import { slides } from "../slides";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PresenterView() {
  const { index, setMode, next, prev } = useSlideController();
  const current = slides[index];
  const upcoming = slides[index + 1];
  const Current = current.component;
  const Next = upcoming?.component;

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div className="absolute inset-0 z-30 bg-slide-bg animate-fade-in flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b rule">
        <div className="flex items-center gap-3">
          <span className="chip font-mono">Presenter</span>
          <span className="text-sm ink-soft">
            Slide {index + 1} of {slides.length} — {current.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg tabular-nums text-slide-ink">{fmt(elapsed)}</span>
          <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setElapsed(0); setRunning(true); }}>
            reset
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setMode("deck")}>
            <X className="h-4 w-4 mr-1" /> Exit
          </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 p-4 min-h-0">
        {/* Current */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden border-2 border-slide-accent shadow-card bg-slide-surface">
            <div className="h-full w-full overflow-auto">
              <Current />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={prev}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <div className="text-xs ink-soft font-mono">
              ← / → to navigate · Space to advance · N to toggle notes
            </div>
            <Button onClick={next}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Side: notes + next */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="rounded-xl border rule bg-slide-bg/60 p-4 shadow-soft flex-1 min-h-0 overflow-y-auto">
            <div className="font-mono text-xs uppercase tracking-widest ink-soft mb-2">Notes</div>
            <p className="text-sm leading-relaxed text-slide-ink whitespace-pre-wrap">{current.notes}</p>
          </div>
          <div className="rounded-xl border rule overflow-hidden bg-slide-surface shadow-soft">
            <div className="px-3 py-2 border-b rule font-mono text-xs uppercase tracking-widest ink-soft">
              Next: {upcoming?.title ?? "—"}
            </div>
            <div className="aspect-[16/9] w-full overflow-hidden">
              {Next && (
                <ScaledThumb width={1280} height={720} scale={0.22}><Next /></ScaledThumb>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScaledThumb({
  width,
  height,
  scale,
  children,
}: {
  width: number;
  height: number;
  scale?: number;
  children: React.ReactNode;
}) {
  // For the upcoming-slide thumb we use a fixed scale. For the main preview we
  // rely on the parent fitting via overflow-hidden + a generous fixed canvas.
  if (scale !== undefined) {
    return (
      <div
        className="origin-top-left"
        style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        <div style={{ width, height }}>{children}</div>
      </div>
    );
  }
  return <div style={{ width, height }}>{children}</div>;
}
