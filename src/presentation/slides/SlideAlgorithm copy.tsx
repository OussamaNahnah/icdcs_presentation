import { useCallback, useEffect, useState } from "react";
import { Pause, Play, SkipForward } from "lucide-react";
import { SlideFrame } from "../SlideFrame";

const NODE_R = 6;
const CELL = 40;
const GRID_COLS = 6;
const GRID_ROWS = 6;
const VIEW_W = 300;
const VIEW_H = 250;
const ORIGIN_X = 50;
const ORIGIN_Y = 25;
const START_RED_COL = 2;
const TARGET_RED_COL = 3;

type Phase = "idle" | "look" | "compute" | "move";

const PHASE_DELAY: Record<Phase, number> = {
  idle: 600,
  look: 900,
  compute: 1000,
  move: 750,
};

const PHASE_INFO = [
  { id: "look" as Phase, label: "Look", activeClass: "bg-blue-500/15 text-blue-500 border-blue-500/40" },
  { id: "compute" as Phase, label: "Compute", activeClass: "bg-amber-500/15 text-amber-500 border-amber-500/40" },
  { id: "move" as Phase, label: "Move", activeClass: "bg-emerald-500/15 text-emerald-500 border-emerald-500/40" },
];

function Dot({ x, y, fill = "#f8fafc", stroke = "#111827", r = NODE_R }: { x: number; y: number; fill?: string; stroke?: string; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth="1.8" />;
}

function RuleCard({ title, mirror = false, active = false }: { title: string; mirror?: boolean; active?: boolean }) {
  const cx = 78;
  const cy = 62;
  const leftX = mirror ? cx + 36 : cx - 36;
  const rightX = mirror ? cx - 36 : cx + 36;

  return (
    <div className={`flex flex-col items-center rounded-xl border px-3 py-4 transition-colors ${active ? "border-slide-accent bg-slide-accent-soft/20" : "rule bg-slide-bg/50"}`}>
      <svg viewBox="0 0 160 120" className="h-28 w-40">
        <line x1={cx} y1={26} x2={cx} y2={98} stroke="#111827" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1={34} y1={cy} x2={126} y2={cy} stroke="#111827" strokeWidth="1.5" strokeDasharray="2 2" />

        <Dot x={leftX} y={cy} fill={mirror ? "#ffffff" : "#111827"} />
        <Dot x={cx} y={cy - 34} fill="#3b82f6" />
        <Dot x={cx} y={cy + 34} fill="#ffffff" />
        <Dot x={cx} y={cy} fill={mirror ? "#3b82f6" : "#10b981"} />
        <Dot x={rightX} y={cy} fill={mirror ? "#10b981" : "#ffffff"} />

        <line x1={cx + (mirror ? -8 : 8)} y1={cy} x2={rightX + (mirror ? 10 : -10)} y2={cy} stroke="#111827" strokeWidth="1.7" />
        <polygon
          points={mirror ? `${rightX + 10},${cy - 4} ${rightX + 3},${cy} ${rightX + 10},${cy + 4}` : `${rightX - 10},${cy - 4} ${rightX - 3},${cy} ${rightX - 10},${cy + 4}`}
          fill="#111827"
        />
      </svg>
      <div className="text-3xl font-semibold text-slide-ink">{title}</div>
    </div>
  );
}

function AlgorithmGrid({ phase, redCol, nextRedCol }: { phase: Phase; redCol: number; nextRedCol: number }) {
  const point = (col: number, row: number) => ({ x: ORIGIN_X + col * CELL, y: ORIGIN_Y + row * CELL });
  const blue = point(1, 2);
  const red = point(redCol, 2);
  const nextRed = point(nextRedCol, 2);

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
      <defs>
        <pattern id="algorithm-grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
          <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke="#111827" strokeWidth="1.5" strokeDasharray="2 2" />
        </pattern>
      </defs>

      <rect
        x={ORIGIN_X}
        y={ORIGIN_Y}
        width={(GRID_COLS - 1) * CELL}
        height={(GRID_ROWS - 1) * CELL}
        fill="url(#algorithm-grid)"
      />

      {phase === "look" && (
        <polygon
          points={`${red.x},${red.y - 80} ${red.x + 80},${red.y} ${red.x},${red.y + 80} ${red.x - 80},${red.y}`}
          fill="#ef4444"
          fillOpacity="0.05"
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="5 3"
          opacity="0.7"
        />
      )}

      {phase === "compute" && (
        <>
          <line
            x1={red.x}
            y1={red.y}
            x2={nextRed.x - 16}
            y2={nextRed.y}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <polygon points={`${nextRed.x - 16},${nextRed.y - 4} ${nextRed.x - 16},${nextRed.y + 4} ${nextRed.x - 10},${nextRed.y}`} fill="#ef4444" />
        </>
      )}

      {Array.from({ length: GRID_ROWS }).map((_, r) =>
        Array.from({ length: GRID_COLS }).map((__, c) => {
          const { x, y } = point(c, r);
          const boundary = r === 0 || c === 0 || r === GRID_ROWS - 1 || c === GRID_COLS - 1;
          const isBlue = x === blue.x && y === blue.y;
          const isRed = x === red.x && y === red.y;
          return <Dot key={`n-${r}-${c}`} x={x} y={y} fill={boundary ? "#111827" : isBlue ? "#3b82f6" : isRed ? "#ef4444" : "#f8fafc"} />;
        })
      )}

      <text x={blue.x - 12} y={blue.y + 30} fontSize="26" fontWeight="700" fill="#111827">R2</text>
      <text x={red.x - 12} y={red.y + 30} fontSize="26" fontWeight="700" fill="#111827">R1</text>

      <line x1={blue.x} y1={blue.y + 10} x2={blue.x} y2={red.y - 12} stroke="#111827" strokeWidth="2" />
      <polygon points={`${blue.x - 4},${red.y - 14} ${blue.x + 4},${red.y - 14} ${blue.x},${red.y - 8}`} fill="#111827" />

      <line x1={blue.x + 12} y1={red.y} x2={red.x - 12} y2={red.y} stroke="#111827" strokeWidth="2" />
      <polygon points={`${red.x - 14},${red.y - 4} ${red.x - 14},${red.y + 4} ${red.x - 8},${red.y}`} fill="#111827" />

      {phase === "compute" && (
        <text x={red.x - 18} y={red.y - 18} fontSize="14" fontWeight="700" fill="#ef4444">match</text>
      )}
    </svg>
  );
}

export default function SlideAlgorithm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [redCol, setRedCol] = useState(START_RED_COL);
  const [nextRedCol, setNextRedCol] = useState(START_RED_COL);
  const [auto, setAuto] = useState(false);
  const [moving, setMoving] = useState(false);
  const rule1Active = phase === "compute" || phase === "move";

  const advancePhase = useCallback(() => {
    if (moving) return;

    if (phase === "idle") {
      if (redCol === TARGET_RED_COL) {
        setRedCol(START_RED_COL);
        setNextRedCol(START_RED_COL);
      }
      setPhase("look");
      return;
    }

    if (phase === "look") {
      setNextRedCol(TARGET_RED_COL);
      setPhase("compute");
      return;
    }

    if (phase === "compute") {
      setMoving(true);
      setRedCol(nextRedCol);
      setPhase("move");
      window.setTimeout(() => {
        setMoving(false);
        setPhase("idle");
      }, PHASE_DELAY.move);
    }
  }, [moving, nextRedCol, phase, redCol]);

  useEffect(() => {
    if (!auto || moving || phase === "move") return;
    const timer = window.setTimeout(advancePhase, PHASE_DELAY[phase]);
    return () => window.clearTimeout(timer);
  }, [advancePhase, auto, moving, phase]);

  return (
    <SlideFrame eyebrow="Model" title="Algorithm">
      <div className="flex h-full gap-6 min-h-0">
        <div className="flex w-72 shrink-0 flex-col gap-3 pt-1">
          <div className="rounded-xl border rule bg-slide-bg/50 p-3">
            <div className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-slide-accent shrink-0" />
              <p className="text-sm font-semibold leading-6 text-slide-ink">An algorithm is a set of rules.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <RuleCard title="Rule1" active={rule1Active} />
            <RuleCard title="Rule2" mirror />
          </div>
        </div>

        <div className="flex flex-1 min-w-0 flex-col gap-3 min-h-0">
          <div className="relative h-[20rem] w-full max-w-[50rem] self-center border rule bg-slide-bg/30 overflow-hidden">
            <AlgorithmGrid phase={phase} redCol={redCol} nextRedCol={nextRedCol} />
          </div>

          <div className="w-full max-w-[50rem] self-center flex items-center justify-between gap-4">
            <div className="flex gap-2 items-center">
              <button
                onClick={advancePhase}
                disabled={moving || auto}
                className="h-10 w-10 flex items-center justify-center rounded-lg border rule hover:bg-slide-accent-soft/40 disabled:opacity-40 transition-colors"
                title="Step"
                aria-label="Step"
              >
                <SkipForward className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAuto((value) => !value)}
                className={`h-10 w-10 flex items-center justify-center rounded-lg border transition-colors ${
                  auto
                    ? "bg-slide-accent text-slide-bg border-slide-accent"
                    : "rule hover:bg-slide-accent-soft/40"
                }`}
                title={auto ? "Pause auto" : "Start auto"}
                aria-label={auto ? "Pause auto" : "Start auto"}
              >
                {auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-lg border rule bg-slide-bg/70 p-1">
                {PHASE_INFO.map((item) => (
                  <span
                    key={item.id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                      phase === item.id
                        ? item.activeClass
                        : "border-transparent text-slate-400"
                    }`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
