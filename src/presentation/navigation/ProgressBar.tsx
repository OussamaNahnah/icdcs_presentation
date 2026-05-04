import { useSlideController } from "../useSlideController";
import { slides } from "../slides";
import { cn } from "@/lib/utils";

export function ProgressBar() {
  const { index, step, stepsForCurrent, goTo } = useSlideController();

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="font-mono text-xs ink-soft tabular-nums whitespace-nowrap">
        {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </span>
      <div className="flex-1 flex items-center gap-1">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, 0)}
            className={cn(
              "group relative flex-1 h-1.5 rounded-full overflow-hidden transition-colors",
              i < index ? "bg-slide-accent" : i === index ? "bg-slide-accent/40" : "bg-slide-rule"
            )}
            aria-label={`Go to ${s.title}`}
          >
            {i === index && (
              <span
                className="absolute inset-y-0 left-0 bg-slide-accent transition-[width]"
                style={{
                  width: `${((step + 1) / stepsForCurrent) * 100}%`,
                }}
              />
            )}
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-slide-ink text-slide-bg px-2 py-0.5 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {s.title}
            </span>
          </button>
        ))}
      </div>
      <span className="font-mono text-xs ink-soft hidden sm:inline whitespace-nowrap">
        step {step + 1}/{stepsForCurrent}
      </span>
    </div>
  );
}
