import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GRID, LightColor, OBSTACLE, SCENARIO } from "./scenario";
import { cn } from "@/lib/utils";

const lightClass: Record<LightColor, string> = {
  off: "bg-robot-off ring-robot-off/40",
  cyan: "bg-robot-cyan ring-robot-cyan/40",
  amber: "bg-robot-amber ring-robot-amber/40",
  rose: "bg-robot-rose ring-robot-rose/40",
  violet: "bg-robot-violet ring-robot-violet/40",
  emerald: "bg-robot-emerald ring-robot-emerald/40",
};

const lightLabel: Record<LightColor, string> = {
  off: "off — idle",
  cyan: "cyan — looking",
  amber: "amber — go straight",
  violet: "violet — steer",
  rose: "rose — converging",
  emerald: "emerald — done",
};

export function SwarmSimulation() {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900); // ms per step
  const timer = useRef<number | null>(null);

  const step = SCENARIO[stepIdx];

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setTimeout(() => {
      setStepIdx((i) => {
        if (i >= SCENARIO.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, stepIdx, speed]);

  const usedLights = useMemo(() => {
    const set = new Set<LightColor>();
    SCENARIO.forEach((s) => s.robots.forEach((r) => set.add(r.light)));
    return Array.from(set);
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* Phase + caption */}
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="chip font-mono">{step.phase}</span>
          <span className="text-sm sm:text-base ink-soft">{step.caption}</span>
        </div>
        <span className="font-mono text-xs ink-soft">
          step {stepIdx + 1}/{SCENARIO.length}
        </span>
      </div>

      {/* Grid */}
      <div className="relative flex-1 min-h-0 rounded-xl border rule bg-slide-bg p-3 shadow-soft">
        <div
          className="relative h-full w-full"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID.rows}, minmax(0, 1fr))`,
            gap: "2px",
          }}
        >
          {Array.from({ length: GRID.cols * GRID.rows }).map((_, i) => {
            const x = i % GRID.cols;
            const y = Math.floor(i / GRID.cols);
            const isObstacle = OBSTACLE.some((o) => o.x === x && o.y === y);
            return (
              <div
                key={i}
                className={cn(
                  "rounded-[3px] border border-slide-grid/60",
                  isObstacle
                    ? "bg-slide-obstacle border-slide-obstacle"
                    : "bg-slide-surface"
                )}
              />
            );
          })}

          {/* Robots overlaid via absolute positioning over the grid box */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="relative h-full w-full"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${GRID.rows}, minmax(0, 1fr))`,
                gap: "2px",
              }}
            >
              {step.robots.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  layoutId={r.id}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  style={{
                    gridColumnStart: r.pos.x + 1,
                    gridRowStart: r.pos.y + 1,
                  }}
                  className="flex items-center justify-center p-[10%]"
                >
                  <div
                    className={cn(
                      "h-full w-full rounded-full ring-[6px] shadow-card animate-pulse-soft",
                      lightClass[r.light]
                    )}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setPlaying(false);
              setStepIdx(0);
            }}
            aria-label="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            disabled={stepIdx === 0}
            aria-label="Previous step"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              if (stepIdx >= SCENARIO.length - 1) setStepIdx(0);
              setPlaying((p) => !p);
            }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setStepIdx((i) => Math.min(SCENARIO.length - 1, i + 1))}
            disabled={stepIdx >= SCENARIO.length - 1}
            aria-label="Next step"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <span className="font-mono text-xs ink-soft whitespace-nowrap">speed</span>
          <Slider
            min={250}
            max={1600}
            step={50}
            value={[1850 - speed]}
            onValueChange={([v]) => setSpeed(1850 - v)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs ink-soft">
        {usedLights.map((l) => (
          <div key={l} className="flex items-center gap-2">
            <span className={cn("inline-block h-3 w-3 rounded-full ring-2", lightClass[l])} />
            <span className="font-mono">{lightLabel[l]}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-slide-obstacle" />
          <span className="font-mono">obstacle</span>
        </div>
      </div>
    </div>
  );
}
