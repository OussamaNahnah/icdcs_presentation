import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Brain, Compass, Eye, Play, Pause, SkipForward } from "lucide-react";
import { SlideFrame } from "../SlideFrame";
import { useSlideController } from "../useSlideController";

// ─── Robot model traits ───────────────────────────────────────────────────────
const CORE_TRAITS = ["Luminous", "Autonomous", "Anonymous", "Homogeneous"];

const GRID_CONSTRAINTS = [
  { label: "No memory", icon: Brain },
  { label: "No compass", icon: Compass },
  { label: "Limited visibility", icon: Eye },
];

const TRAIT_STEPS = CORE_TRAITS.length;

// ─── Simulation constants ─────────────────────────────────────────────────────
const CELL = 40;
const LOGICAL_COLS = 20;
const LOGICAL_ROWS = 20;
const LOGICAL_W = LOGICAL_COLS * CELL;
const LOGICAL_H = LOGICAL_ROWS * CELL;

// Show only the needed top-left window of the 20x20 grid.
const VIEW_COLS = 12;
const VIEW_ROWS = 6;
const VIEW_W = VIEW_COLS * CELL;
const VIEW_H = VIEW_ROWS * CELL;

const CY = 120;
const INIT = { r1: 120, r2: 200 };

type Phase = "idle" | "look" | "compute" | "move";

const PHASE_DELAY: Record<Phase, number> = {
  idle: 600, look: 900, compute: 1100, move: 750,
};

// ─── Slide ────────────────────────────────────────────────────────────────────
export default function SlideModel() {
  const step = useSlideController((s) => s.step);
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [pos,     setPos]     = useState(INIT);
  const [nextPos, setNextPos] = useState(INIT);
  const [auto,    setAuto]    = useState(false);
  const [moving,  setMoving]  = useState(false);

  const advance = useCallback(() => {
    if (moving) return;

    if (phase === "idle") {
      if (pos.r2 + CELL > VIEW_W - 2 * CELL) { setPos(INIT); setNextPos(INIT); }
      setPhase("look");
    } else if (phase === "look") {
      setNextPos({ r1: pos.r1 + CELL, r2: pos.r2 + CELL });
      setPhase("compute");
    } else if (phase === "compute") {
      setMoving(true);
      setPos({ r1: pos.r1 + CELL, r2: pos.r2 + CELL });
      setPhase("move");
      setTimeout(() => { setMoving(false); setPhase("idle"); }, 750);
    }
  }, [phase, pos, moving]);

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(advance, PHASE_DELAY[phase]);
    return () => clearTimeout(t);
  }, [auto, phase, advance]);

  return (
    <SlideFrame eyebrow="Model" title="Luminous Robots">
      <div className="flex gap-6 flex-1 min-h-0">

        {/* ── Left: robot traits ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-2.5 w-60 shrink-0 justify-start pt-1">
          {CORE_TRAITS.map((label, i) => (
            step >= i && (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-xl border rule p-3 bg-slide-bg/50"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slide-accent shrink-0" />
                  <span className="text-sm font-semibold text-slide-ink">{label}</span>
                </div>
              </motion.div>
            )
          ))}
        </div>

        {/* ── Right: LCM simulation ──────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 gap-3 min-h-0">

          {/* SVG canvas */}
          <div className="relative h-[20rem] w-full max-w-[50rem] self-center border rule bg-slide-bg/30 overflow-hidden">
            {step >= TRAIT_STEPS && (
              <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2 pointer-events-none">
                {GRID_CONSTRAINTS.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 rounded-md border rule bg-slide-bg/85 px-2 py-1"
                  >
                    <Icon className="h-3.5 w-3.5 ink-soft" />
                    <span className="text-[11px] font-medium text-slide-ink">{label}</span>
                  </div>
                ))}
              </div>
            )}
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMinYMin meet" className="w-full h-full">
              <defs>
                <pattern id="lcm-g" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                  <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke="rgba(100,116,139,0.15)" strokeWidth="1" />
                </pattern>
                <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M1,1 L7,4 L1,7 Z" fill="#f59e0b" />
                </marker>
              </defs>
              <rect width={LOGICAL_W} height={LOGICAL_H} fill="url(#lcm-g)" />

              {/* Visibility range — Look phase */}
              {phase === "look" && <>
                <circle cx={pos.r1} cy={CY} r={90} fill="#3b82f6" fillOpacity="0.05"
                  stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 3" opacity="0.7" />
                <circle cx={pos.r2} cy={CY} r={90} fill="#ef4444" fillOpacity="0.05"
                  stroke="#ef4444" strokeWidth="1" strokeDasharray="5 3" opacity="0.7" />
              </>}

              {/* Intended-move arrows — Compute phase */}
              {phase === "compute" && <>
                <line x1={pos.r1} y1={CY} x2={nextPos.r1 - 24} y2={CY}
                  stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr)" />
                <line x1={pos.r2} y1={CY} x2={nextPos.r2 - 24} y2={CY}
                  stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr)" />
              </>}

              {/* Robot 1 (blue light) */}
              <g style={{
                transform: `translate(${pos.r1}px, ${CY}px)`,
                transition: moving ? "transform 0.75s ease-in-out" : "none",
              }}>
                <RobotSVG color="#3b82f6" computing={phase === "compute"} />
              </g>

              {/* Robot 2 (red light) */}
              <g style={{
                transform: `translate(${pos.r2}px, ${CY}px)`,
                transition: moving ? "transform 0.75s ease-in-out" : "none",
              }}>
                <RobotSVG color="#ef4444" computing={phase === "compute"} />
              </g>
            </svg>
          </div>

          {/* Bottom row: controls (left), phases (right) */}
          {step >= TRAIT_STEPS + 1 && (
            <div className="w-full max-w-[50rem] self-center flex items-center justify-between gap-4">
              <div className="flex gap-2 items-center">
                <button
                  onClick={advance}
                  disabled={moving || auto}
                  className="h-10 w-10 flex items-center justify-center rounded-lg border rule hover:bg-slide-accent-soft/40 disabled:opacity-40 transition-colors"
                  title="Step"
                  aria-label="Step"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setAuto(a => !a)}
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
                  {PHASE_INFO.map((p) => (
                    <span
                      key={p.id}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                        phase === p.id
                          ? p.activeClass
                          : "border-transparent text-slate-400"
                      }`}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

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

// ─── Robot SVG ────────────────────────────────────────────────────────────────
function RobotSVG({ color, computing }: { color: string; computing: boolean }) {
  return (
    <g>
      {/* Compute indicator dot */}
      <circle cx={0} cy={-34} r={4} fill="#f59e0b"
        style={{ opacity: computing ? 1 : 0, transition: "opacity 0.3s" }} />
      {/* Antennae */}
      <line x1={-8} y1={-14} x2={-13} y2={-23} stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1={ 8} y1={-14} x2={ 13} y2={-23} stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      {/* Body */}
      <rect x={-16} y={-16} width={32} height={32} rx={9} fill="white" stroke="#334155" strokeWidth="2" />
      {/* Luminous light */}
      <circle cx={0} cy={0} r={7} fill={color} />
    </g>
  );
}
