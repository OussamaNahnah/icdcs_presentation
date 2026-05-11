import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { SlideFrame } from "../SlideFrame";
import { useSlideController } from "../useSlideController";

const LCM_PANEL_STEP = 1;

// ─── Simulation constants ─────────────────────────────────────────────────────
const ISO_TILE_W = 88;
const ISO_TILE_H = 44;
const ISO_COLS = 8;
const ISO_ROWS = 5;
const VIEW_MIN_X = 24;
const VIEW_MIN_Y = 28;
const VIEW_W = 468;
const VIEW_H = 272;
const ISO_ORIGIN = { x: 258, y: 60 };
const ROBOT_ROW = 2;
const INIT = { r1: 1, r2: 2 };

type Phase = "idle" | "look" | "compute" | "move";

const PHASE_DELAY: Record<Phase, number> = {
  idle: 1400, look: 1400, compute: 1400, move: 1400,
};

const SPEED_LEVELS = [0.45, 0.65, 1, 1.35];

type RobotPositions = typeof INIT;
type IsoPoint = { x: number; y: number };

function toIso(x: number, y: number): IsoPoint {
  return {
    x: ISO_ORIGIN.x + (x - y) * (ISO_TILE_W / 2),
    y: ISO_ORIGIN.y + (x + y) * (ISO_TILE_H / 2),
  };
}

function getVisibilityDiamond(x: number, y: number) {
  return [toIso(x, y - 1), toIso(x + 1, y), toIso(x, y + 1), toIso(x - 1, y)];
}

function getArrowTarget(start: IsoPoint, end: IsoPoint, trim = 28): IsoPoint {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: end.x - (dx / length) * trim,
    y: end.y - (dy / length) * trim,
  };
}

const GRID_LINES = [
  ...Array.from({ length: ISO_ROWS + 1 }, (_, row) => {
    const start = toIso(0, row);
    const end = toIso(ISO_COLS, row);
    return { key: `row-${row}`, start, end };
  }),
  ...Array.from({ length: ISO_COLS + 1 }, (_, col) => {
    const start = toIso(col, 0);
    const end = toIso(col, ISO_ROWS);
    return { key: `col-${col}`, start, end };
  }),
];

const FLOOR_POINTS = [
  toIso(0, 0),
  toIso(ISO_COLS, 0),
  toIso(ISO_COLS, ISO_ROWS),
  toIso(0, ISO_ROWS),
]
  .map((point) => `${point.x},${point.y}`)
  .join(" ");

// ─── Slide ────────────────────────────────────────────────────────────────────
export default function SlideModel() {
  const step = useSlideController((s) => s.step);
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [pos,     setPos]     = useState(INIT);
  const [nextPos, setNextPos] = useState(INIT);
  const [moving,  setMoving]  = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [auto,    setAuto]    = useState(true);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);

  const activePhase: Phase = phase;
  const shouldAutoLoop = step >= LCM_PANEL_STEP && auto;
  const speed = SPEED_LEVELS[speedIndex];
  const moveDurationMs = Math.round(750 / speed);
  const displayPos = pos;
  const displayedNextPos = nextPos;
  const robotScene = [
    { id: "r1", color: "#3b82f6", label: "Robot with blue light", cell: displayPos.r1, nextCell: displayedNextPos.r1 },
    { id: "r2", color: "#ef4444", label: "Robot with red light", cell: displayPos.r2, nextCell: displayedNextPos.r2 },
  ]
    .map((robot) => {
      const floor = toIso(robot.cell, ROBOT_ROW);
      const nextFloor = toIso(robot.nextCell, ROBOT_ROW);
      return {
        ...robot,
        floor,
        nextFloor,
        depth: robot.cell + ROBOT_ROW,
      };
    })
    .sort((left, right) => left.depth - right.depth);

  const advance = useCallback(() => {
    if (moving) return;

    if (phase === "idle") {
      setPhase("look");
    } else if (phase === "look") {
      setNextPos({ r1: pos.r1 + 1, r2: pos.r2 + 1 });
      setPhase("compute");
    } else if (phase === "compute") {
      setMoving(true);
      setPos({ r1: pos.r1 + 1, r2: pos.r2 + 1 });
      setPhase("move");
      setTimeout(() => {
        const newCycle = cycleCount + 1;
        setMoving(false);
        if (newCycle >= 4) {
          setPos(INIT);
          setNextPos(INIT);
          setCycleCount(0);
        } else {
          setCycleCount(newCycle);
        }
        setPhase("idle");
      }, moveDurationMs);
    }
  }, [phase, pos, moving, cycleCount, moveDurationMs]);

  useEffect(() => {
    if (!shouldAutoLoop) return;
    const t = setTimeout(advance, Math.round(PHASE_DELAY[phase] / speed));
    return () => clearTimeout(t);
  }, [shouldAutoLoop, phase, advance, speed]);

  useEffect(() => {
    if (step !== LCM_PANEL_STEP) return;
    setPhase("idle");
    setPos(INIT);
    setNextPos(INIT);
    setMoving(false);
    setCycleCount(0);
  }, [step]);

  return (
    <SlideFrame eyebrow="Model" title="Luminous Robots">
      <div className="grid grid-cols-2 flex-1 min-h-0 gap-6">

        {/* ── Left: robot picture + criteria ─────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-4 pt-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-3"
          >
            <p className="text-base leading-relaxed text-slide-ink sm:text-lg">
              Simple robots equipped with <strong>visible light colors</strong>.
            </p>
            <p className="text-base leading-relaxed text-slide-ink sm:text-lg">
              They are <strong>autonomous</strong>, <strong>anonymous</strong>,
              <strong> homogeneous</strong>, have <strong>no memory</strong>,
              <strong> no compass</strong>, <strong>no communication</strong>,
              <strong> limited visibility</strong>, and operate in
              <strong> synchronous LCM cycles</strong>.
            </p>
          </motion.div>
          <div className="relative overflow-hidden rounded-2xl bg-transparent">
            <svg viewBox="-130 105 260 150" preserveAspectRatio="xMidYMid meet" className="block h-44 w-full">
              <g transform="translate(0, -28) scale(1.22)">
              {/* Grid lines */}
              <g stroke="#e2e8f0" strokeWidth="1.5">
                {/* Horizontal-ish */}
                <line x1="0" y1="0" x2="-311.76" y2="180" />
                <line x1="51.96" y1="30" x2="-259.8" y2="210" />
                <line x1="103.92" y1="60" x2="-207.84" y2="240" />
                <line x1="155.88" y1="90" x2="-155.88" y2="270" />
                <line x1="207.84" y1="120" x2="-103.92" y2="300" />
                <line x1="259.8" y1="150" x2="-51.96" y2="330" />
                <line x1="311.76" y1="180" x2="0" y2="360" />

                {/* Vertical-ish */}
                <line x1="0" y1="0" x2="311.76" y2="180" />
                <line x1="-51.96" y1="30" x2="259.8" y2="210" />
                <line x1="-103.92" y1="60" x2="207.84" y2="240" />
                <line x1="-155.88" y1="90" x2="155.88" y2="270" />
                <line x1="-207.84" y1="120" x2="103.92" y2="300" />
                <line x1="-259.8" y1="150" x2="51.96" y2="330" />
                <line x1="-311.76" y1="180" x2="0" y2="360" />
              </g>

              {/* Robot 1 (Blue) snapped on center node */}
              <g transform="translate(0, 150)">
                <ellipse cx="0" cy="25" rx="20" ry="10" fill="black" opacity="0.15" />
                <g transform="translate(0, -12)">
                  <path d="M-12,5 L12,5 L10,24 Q0,28 -10,24 Z" fill="#e2e8f0" stroke="#94a3b8" />
                  <ellipse cx="0" cy="0" rx="18" ry="15" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M-14,-2 Q0,2 14,-2 L14,4 Q0,8 -14,4 Z" fill="#1e293b" />
                  <circle cx="-6" cy="1.5" r="1.5" fill="#22d3ee" />
                  <circle cx="6" cy="1.5" r="1.5" fill="#22d3ee" />
                  <ellipse cx="0" cy="-8" rx="10" ry="4" fill="#3b82f6" />
                </g>
              </g>

              {/* Robot 2 (Red) snapped on adjacent node (distance 1) */}
              <g transform="translate(51.96, 180)">
                <ellipse cx="0" cy="25" rx="20" ry="10" fill="black" opacity="0.15" />
                <g transform="translate(0, -12)">
                  <path d="M-12,5 L12,5 L10,24 Q0,28 -10,24 Z" fill="#e2e8f0" stroke="#94a3b8" />
                  <ellipse cx="0" cy="0" rx="18" ry="15" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M-14,-2 Q0,2 14,-2 L14,4 Q0,8 -14,4 Z" fill="#1e293b" />
                  <circle cx="-6" cy="1.5" r="1.5" fill="#22d3ee" />
                  <circle cx="6" cy="1.5" r="1.5" fill="#22d3ee" />
                  <ellipse cx="0" cy="-8" rx="10" ry="4" fill="#ef4444" />
                </g>
              </g>
              </g>
            </svg>
          </div>
        </div>

        {/* ── Right: LCM simulation ──────────────────────────────────────── */}
        {step >= LCM_PANEL_STEP && (
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="flex min-w-0 flex-col gap-3 min-h-0"
        >

          {/* SVG canvas */}
          <div
            className="relative h-[20rem] w-full rounded-2xl border rule bg-slide-bg/30 shadow-soft overflow-hidden"
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
          >
            <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap gap-2 pointer-events-none">
              <div className="flex items-center gap-2 rounded-full border rule bg-white/92 px-3 py-1.5 text-[11px] font-medium text-slide-ink shadow-sm backdrop-blur">
                  <span className="h-3 w-3 rounded-full border border-slate-900 bg-blue-500" />
                  <span>Robot with blue light</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border rule bg-white/92 px-3 py-1.5 text-[11px] font-medium text-slide-ink shadow-sm backdrop-blur">
                  <span className="h-3 w-3 rounded-full border border-slate-900 bg-red-500" />
                  <span>Robot with red light</span>
              </div>
            </div>
            <svg viewBox={`${VIEW_MIN_X} ${VIEW_MIN_Y} ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
              <defs>
                <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M1,1 L7,4 L1,7 Z" fill="#3b82f6" />
                </marker>
                <marker id="arr-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M1,1 L7,4 L1,7 Z" fill="#ef4444" />
                </marker>
              </defs>
              <polygon points={FLOOR_POINTS} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              {GRID_LINES.map((line) => (
                <line
                  key={line.key}
                  x1={line.start.x}
                  y1={line.start.y}
                  x2={line.end.x}
                  y2={line.end.y}
                  stroke="#cbd5e1"
                  strokeWidth="1.25"
                />
              ))}

              {/* Visibility range — Look phase */}
              {activePhase === "look" && robotScene.map((robot) => (
                <polygon
                  key={`vision-${robot.id}`}
                  points={getVisibilityDiamond(robot.cell, ROBOT_ROW).map((point) => `${point.x},${point.y}`).join(" ")}
                  fill={robot.color}
                  fillOpacity="0.08"
                  stroke={robot.color}
                  strokeWidth="1.3"
                  strokeDasharray="5 4"
                  opacity="0.75"
                />
              ))}

              {/* Intended-move arrows — Compute phase */}
              {activePhase === "compute" && robotScene.map((robot) => {
                const arrowTarget = getArrowTarget(robot.floor, robot.nextFloor);
                return (
                  <line
                    key={`arrow-${robot.id}`}
                    x1={robot.floor.x}
                    y1={robot.floor.y}
                    x2={arrowTarget.x}
                    y2={arrowTarget.y}
                    stroke={robot.color}
                    strokeWidth="2"
                    strokeDasharray="5 4"
                    markerEnd={robot.id === "r1" ? "url(#arr-blue)" : "url(#arr-red)"}
                  />
                );
              })}

              {robotScene.map((robot) => (
                <g
                  key={robot.id}
                  style={{
                    transform: `translate(${robot.floor.x}px, ${robot.floor.y}px)`,
                    transition: moving ? `transform ${moveDurationMs}ms ease-in-out` : "none",
                  }}
                >
                  <RobotSVG color={robot.color} computing={activePhase === "compute"} />
                </g>
              ))}
            </svg>

            {/* Hidden play/pause — visible on hover over grid, bottom-right corner */}
            <AnimatePresence>
              {hoverBtn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-3 right-3 z-20 flex items-center gap-2"
                >
                  <button
                    onClick={() => setSpeedIndex((i) => Math.max(0, i - 1))}
                    disabled={speedIndex === 0}
                    className="flex h-8 items-center justify-center rounded-full bg-white/80 px-2 text-[11px] font-semibold text-slate-700 backdrop-blur border border-slate-200 shadow-md hover:bg-white disabled:opacity-40"
                    title="Slower"
                    aria-label="Slower"
                  >
                    Slower
                  </button>
                  <button
                    onClick={() => setSpeedIndex((i) => Math.min(SPEED_LEVELS.length - 1, i + 1))}
                    disabled={speedIndex === SPEED_LEVELS.length - 1}
                    className="flex h-8 items-center justify-center rounded-full bg-white/80 px-2 text-[11px] font-semibold text-slate-700 backdrop-blur border border-slate-200 shadow-md hover:bg-white disabled:opacity-40"
                    title="Faster"
                    aria-label="Faster"
                  >
                    Faster
                  </button>
                  <button
                    onClick={() => setAuto(a => !a)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur border border-slate-200 shadow-md text-slate-700 hover:bg-white transition-colors"
                    title={auto ? "Pause" : "Play"}
                    aria-label={auto ? "Pause simulation" : "Play simulation"}
                  >
                    {auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full flex items-center justify-between gap-4 rounded-2xl border rule bg-slide-bg/45 px-4 py-3 shadow-soft">
            {/* div className="w-full flex items-center justify-between gap-4" */}
            <div className="text-sm sm:text-[15px] text-slate-600 min-w-0">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activePhase}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  {activePhase === "look" && "Capturing their local views..."}
                  {activePhase === "compute" && "Computing..."}
                  {activePhase === "move" && "Moving..."}
                  {activePhase === "idle" && "\u00a0"}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-lg border rule bg-slide-bg/70 p-1">
                {PHASE_INFO.map((phaseInfo) => (
                  <span
                    key={phaseInfo.id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                      activePhase === phaseInfo.id
                        ? phaseInfo.activeClass
                        : "border-transparent text-slate-400"
                    }`}
                  >
                    {phaseInfo.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        )}

      </div>
    </SlideFrame>
  );
}

// ─── Phase metadata ───────────────────────────────────────────────────────────
const PHASE_INFO = [
  { id: "look" as Phase, label: "Look", activeClass: "bg-blue-500/15 text-blue-500 border-blue-500/40" },
  { id: "compute" as Phase, label: "Compute", activeClass: "bg-amber-500/15 text-amber-500 border-amber-500/40" },
  { id: "move" as Phase, label: "Move", activeClass: "bg-emerald-500/15 text-emerald-500 border-emerald-500/40" },
];

// ─── Robot marker (dot only) ────────────────────────────────────────────────
function RobotSVG({ color, computing }: { color: string; computing: boolean }) {
  return (
    <g>
      {/* Compute indicator: pulse */}
      {computing && (
        <>
          <circle cx={0} cy={-30} r={12} fill="none" stroke="#f59e0b" strokeWidth="1.3" opacity="0.75">
            <animate attributeName="r" values="12;18;12" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;1;0.45" dur="0.9s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      <ellipse cx={0} cy={12} rx={18} ry={8} fill="#0f172a" opacity="0.14" />
      <g transform="translate(0, -22)">
        <path d="M-12,5 L12,5 L10,24 Q0,28 -10,24 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
        <ellipse cx={0} cy={0} rx={18} ry={15} fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M-14,-2 Q0,2 14,-2 L14,4 Q0,8 -14,4 Z" fill="#1e293b" />
        <circle cx={-6} cy={1.5} r={1.5} fill="#22d3ee" />
        <circle cx={6} cy={1.5} r={1.5} fill="#22d3ee" />
        <ellipse cx={0} cy={-8} rx={10} ry={4} fill={color} />
      </g>
    </g>
  );
}

