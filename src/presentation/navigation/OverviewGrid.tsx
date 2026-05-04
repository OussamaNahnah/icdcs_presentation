import { useSlideController } from "../useSlideController";
import { slides } from "../slides";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/**
 * Overview grid: shows all slides as scaled thumbnails. Click to enter that slide.
 * Each thumbnail renders the actual slide component inside a fixed-aspect viewport.
 */
export function OverviewGrid() {
  const { index, goTo, setMode } = useSlideController();

  const enter = (i: number) => {
    goTo(i, 0);
    setMode("deck");
  };

  return (
    <div className="absolute inset-0 z-30 bg-slide-bg/95 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b rule bg-slide-bg/80 backdrop-blur">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest ink-soft">Overview</div>
          <div className="font-display text-xl text-slide-ink">All slides</div>
        </div>
        <button
          onClick={() => setMode("deck")}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border rule hover:bg-slide-accent-soft transition-colors"
        >
          <X className="h-4 w-4" /> Close
        </button>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {slides.map((s, i) => {
          const Slide = s.component;
          return (
            <button
              key={s.id}
              onClick={() => enter(i)}
              className={cn(
                "group relative overflow-hidden rounded-xl border-2 bg-slide-surface text-left shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5",
                i === index ? "border-slide-accent" : "border-slide-rule"
              )}
            >
              {/* Thumbnail: render the slide at 1280x720 then scale via aspect-ratio container */}
              <div className="aspect-[16/9] w-full overflow-hidden">
                <div
                  className="origin-top-left"
                  style={{
                    width: 1280,
                    height: 720,
                    transform: "scale(0.25)",
                    transformOrigin: "top left",
                  }}
                >
                  <div style={{ width: 1280, height: 720 }}>
                    <Slide />
                  </div>
                </div>
              </div>
              <div className="flex items-baseline justify-between border-t rule px-4 py-2.5">
                <span className="font-mono text-xs ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-slide-ink">{s.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
