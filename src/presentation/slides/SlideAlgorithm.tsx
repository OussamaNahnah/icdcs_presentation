import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { SlideFrame } from "../SlideFrame";
import { useSlideController } from "../useSlideController";

const LCM_PANEL_STEP = 1;

// ─── Simulation constants ─────────────────────────────────────────────────────
const CELL = 40;
const LOGICAL_COLS = 20;
const LOGICAL_ROWS = 20;
const LOGICAL_W = LOGICAL_COLS * CELL;
const LOGICAL_H = LOGICAL_ROWS * CELL;

// Show a tighter window so each visible grid cell appears larger.
const VIEW_COLS = 8;
const VIEW_ROWS = 4;
const VIEW_W = VIEW_COLS * CELL;
const VIEW_H = VIEW_ROWS * CELL;

const CY = 120;
const INIT = { r1: 80, r2: 120 };

type Phase = "idle" | "look" | "compute" | "move";

const PHASE_DELAY: Record<Phase, number> = {
  idle: 1400, look: 1400, compute: 1400, move: 1400,
};

const SPEED_LEVELS = [0.45, 0.65, 1, 1.35];
const LOOK_STEP = 2;
const COMPUTE_STEP = 3;
const MOVE_STEP = 4;

// ─── Slide ────────────────────────────────────────────────────────────────────
export default function SlideModel() {
  const step = useSlideController((s) => s.step);
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [pos,     setPos]     = useState(INIT);
  const [nextPos, setNextPos] = useState(INIT);
  const [auto,    setAuto]    = useState(false);
  const [moving,  setMoving]  = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [rulesFound, setRulesFound] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);

  const activePhase: Phase = phase;
  const speed = SPEED_LEVELS[speedIndex];
  const moveDurationMs = Math.round(750 / speed);
  const displayPos = pos;
  const displayedNextPos = nextPos;

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
      setTimeout(() => { setMoving(false); setPhase("idle"); }, moveDurationMs);
    }
  }, [phase, pos, moving, moveDurationMs]);

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(advance, Math.round(PHASE_DELAY[phase] / speed));
    return () => clearTimeout(t);
  }, [auto, phase, advance, speed]);

  useEffect(() => {
    if (step < LCM_PANEL_STEP || auto) return;

    if (step === LCM_PANEL_STEP) {
      setPhase("idle");
      setPos(INIT);
      setNextPos(INIT);
      setMoving(false);
      return;
    }

    if (step === LOOK_STEP) {
      setPhase("look");
      setPos(INIT);
      setNextPos(INIT);
      setMoving(false);
      return;
    }

    if (step === COMPUTE_STEP) {
      setPhase("compute");
      setPos(INIT);
      setNextPos({ r1: INIT.r1 + CELL, r2: INIT.r2 + CELL });
      setMoving(false);
      return;
    }

    if (step >= MOVE_STEP) {
      const moved = { r1: INIT.r1 + CELL, r2: INIT.r2 + CELL };
      setPhase("move");
      setPos(moved);
      setNextPos(moved);
      setMoving(false);
    }
  }, [step, auto]);

  useEffect(() => {
    if (phase !== "compute") {
      setRulesFound(false);
      return;
    }

    const t = setTimeout(() => setRulesFound(true), Math.round(900 / speed));
    return () => clearTimeout(t);
  }, [phase, speed]);

  return (
    <SlideFrame eyebrow="Model" title="Algorithm">
      <div className="grid grid-cols-2 flex-1 min-h-0 gap-6">

        {/* ── Left: criteria ─────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-4 pt-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-3"
          >
            <div className="rounded-xl border rule bg-slide-bg/45 p-3">
              <div className="text-base text-slide-ink sm:text-lg">
                <span>An <strong>algorithm</strong> is a set of <strong>rules</strong>.</span>
              </div>
            </div>

            <div className="rounded-xl border rule bg-slide-bg/45 p-3">
              <div className="mb-2 text-base text-slide-ink sm:text-lg">
                <span>Each <strong>rule</strong> contains:</span>
              </div>
              <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed text-slide-ink sm:text-base">
                <li><strong>View</strong>: what the robot sees locally.</li>
                <li><strong>Direction</strong>: where it moves next.</li>
                <li><strong>Color</strong>: light update.</li>
              </ul>
            </div>

            <div className="text-base text-slide-ink sm:text-lg">
              <span>Example with <strong>two rules</strong>:</span>
            </div>
          </motion.div>

          <div className="flex flex-row gap-3">
            {RULE_DEFINITIONS.map((rule) => (
              <StandardRuleCard
                key={rule.title}
                rule={rule}
                selected={activePhase === "compute" && rulesFound}
                accentColor={rule.title === "Rule 1" ? "#3b82f6" : "#ef4444"}
              />
            ))}
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
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMinYMin meet" className="w-full h-full">
              <defs>
                <pattern id="lcm-g" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                  <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke="#111827" strokeWidth="1.5" strokeDasharray="2 2" />
                </pattern>
                <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M1,1 L7,4 L1,7 Z" fill="#3b82f6" />
                </marker>
                <marker id="arr-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M1,1 L7,4 L1,7 Z" fill="#ef4444" />
                </marker>
              </defs>
              <rect width={LOGICAL_W} height={LOGICAL_H} fill="url(#lcm-g)" />

              {/* Visibility range — Look phase */}
              {activePhase === "look" && <>
                <polygon
                  points={`${displayPos.r1},${CY - CELL} ${displayPos.r1 + CELL},${CY} ${displayPos.r1},${CY + CELL} ${displayPos.r1 - CELL},${CY}`}
                  fill="#3b82f6"
                  fillOpacity="0.05"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeDasharray="5 3"
                  opacity="0.7"
                />
                <polygon
                  points={`${displayPos.r2},${CY - CELL} ${displayPos.r2 + CELL},${CY} ${displayPos.r2},${CY + CELL} ${displayPos.r2 - CELL},${CY}`}
                  fill="#ef4444"
                  fillOpacity="0.05"
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="5 3"
                  opacity="0.7"
                />
              </>}

              {/* Intended-move arrows — Compute phase */}
              {activePhase === "compute" && <>
                <line x1={displayPos.r1} y1={CY} x2={displayedNextPos.r1 - 24} y2={CY}
                  stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr-blue)" />
                <line x1={displayPos.r2} y1={CY} x2={displayedNextPos.r2 - 24} y2={CY}
                  stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr-red)" />

                {rulesFound && (
                  <>
                    <text x={displayPos.r1} y={CY - 18} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8">
                      Rule 1
                    </text>
                    <text x={displayPos.r2} y={CY - 18} textAnchor="middle" fontSize="10" fontWeight="700" fill="#b91c1c">
                      Rule 2
                    </text>
                  </>
                )}
              </>}

              {/* Robot 1 (blue light) */}
              <g style={{
                transform: `translate(${displayPos.r1}px, ${CY}px)`,
                transition: moving ? `transform ${moveDurationMs}ms ease-in-out` : "none",
              }}>
                <RobotSVG color="#3b82f6" computing={activePhase === "compute"} />
              </g>

              {/* Robot 2 (red light) */}
              <g style={{
                transform: `translate(${displayPos.r2}px, ${CY}px)`,
                transition: moving ? `transform ${moveDurationMs}ms ease-in-out` : "none",
              }}>
                <RobotSVG color="#ef4444" computing={activePhase === "compute"} />
              </g>
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
                  {activePhase === "compute" && (rulesFound ? "Rules found." : "Computing...")}
                  {activePhase === "move" && "Moving..."}
                  {activePhase === "idle" && "\u00a0"}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="inline-flex items-center rounded-lg border rule bg-slide-bg/70 p-1">
              {PHASE_INFO.map((p) => (
                <span
                  key={p.id}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                    activePhase === p.id
                      ? p.activeClass
                      : "border-transparent text-slate-400"
                  }`}
                >
                  {p.label}
                </span>
              ))}
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

// ─── Reusable rule standard ──────────────────────────────────────────────────
type Direction = "up" | "down" | "left" | "right";

type RuleDefinition = {
  title: string;
  view: {
    center: string;
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  action: {
    direction: Direction;
    nextColor: string;
  };
};

const RULE_DEFINITIONS: RuleDefinition[] = [
  {
    title: "Rule 1",
    view: {
      center: "#3b82f6",
      top: "#ffffff",
      bottom: "#ffffff",
      left: "#ffffff",
      right: "#ff0000",
    },
    action: {
      direction: "right",
      nextColor: "#3b82f6",
    },
  },
  {
    title: "Rule 2",
    view: {
      center: "#ff0000",
      top: "#ffffff",
      bottom: "#ffffff",
      left: "#3b82f6",
      right: "#ffffff",
    },
    action: {
      direction: "right",
      nextColor: "#ff0000",
    },
  },
];

function RuleCardFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-between rounded-xl border px-0 py-2 transition-colors rule bg-slide-bg/50">
      <svg viewBox="0 0 180 130" className="h-32 w-40">
        {children}
      </svg>
      <div className="mt-1 text-base font-semibold text-slide-ink">{title}</div>
    </div>
  );
}

function directionDelta(direction: Direction): { dx: number; dy: number } {
  if (direction === "right") return { dx: 22, dy: 0 };
  if (direction === "left") return { dx: -22, dy: 0 };
  if (direction === "up") return { dx: 0, dy: -22 };
  return { dx: 0, dy: 22 };
}

function directionTipPoints(x: number, y: number, direction: Direction): string {
  if (direction === "right") return `${x - 8},${y - 4} ${x},${y} ${x - 8},${y + 4}`;
  if (direction === "left") return `${x + 8},${y - 4} ${x},${y} ${x + 8},${y + 4}`;
  if (direction === "up") return `${x - 4},${y + 8} ${x},${y} ${x + 4},${y + 8}`;
  return `${x - 4},${y - 8} ${x},${y} ${x + 4},${y - 8}`;
}

function StandardRuleCard({ rule, selected, accentColor }: { rule: RuleDefinition; selected: boolean; accentColor: string }) {
  const NODE_R = 10;
  const vx = 90;
  const vy = 65;
  const NEIGHBOR_OFFSET = 37;
  const { dx, dy } = directionDelta(rule.action.direction);
  const arrowStop = NEIGHBOR_OFFSET - NODE_R - 1;
  const viewTipX = vx + Math.sign(dx) * arrowStop;
  const viewTipY = vy + Math.sign(dy) * arrowStop;

  return (
    <motion.div
      animate={selected
        ? {
            y: [0, -2, 0],
            boxShadow: [`0 0 0 0 ${accentColor}00`, `0 0 0 3px ${accentColor}55`, `0 0 0 0 ${accentColor}00`],
            borderColor: accentColor,
          }
        : {
            y: 0,
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
            borderColor: "#d1d5db",
          }
      }
      transition={{ duration: 0.8, repeat: selected ? Infinity : 0 }}
      className="rounded-xl"
    >
      <RuleCardFrame title={rule.title}>
        <line x1={vx} y1={29} x2={vx} y2={101} stroke="#111827" strokeWidth="1.6" strokeDasharray="2 2" />
        <line x1={vx - 37} y1={vy} x2={vx + 37} y2={vy} stroke="#111827" strokeWidth="1.6" strokeDasharray="2 2" />
        <circle cx={vx} cy={vy - 37} r={NODE_R} fill={rule.view.top} stroke="#111827" strokeWidth="1.8" />
        <circle cx={vx} cy={vy + 37} r={NODE_R} fill={rule.view.bottom} stroke="#111827" strokeWidth="1.8" />
        <circle cx={vx - 37} cy={vy} r={NODE_R} fill={rule.view.left} stroke="#111827" strokeWidth="1.8" />
        <circle cx={vx + 37} cy={vy} r={NODE_R} fill={rule.view.right} stroke="#111827" strokeWidth="1.8" />
        <circle cx={vx} cy={vy} r={NODE_R} fill={rule.view.center} stroke="#111827" strokeWidth="1.9" />
        <line x1={vx} y1={vy} x2={viewTipX} y2={viewTipY} stroke={rule.action.nextColor} strokeWidth="3" />
        <polygon points={directionTipPoints(viewTipX, viewTipY, rule.action.direction)} fill={rule.action.nextColor} />
      </RuleCardFrame>
    </motion.div>
  );
}

// ─── Robot marker (dot only) ────────────────────────────────────────────────
function RobotSVG({ color, computing }: { color: string; computing: boolean }) {
  return (
    <g>
      {/* Compute indicator: pulse */}
      {computing && (
        <>
          <circle cx={0} cy={0} r={9} fill="none" stroke="#f59e0b" strokeWidth="1.3" opacity="0.75">
            <animate attributeName="r" values="9;13;9" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;1;0.45" dur="0.9s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      {/* Robot as a luminous dot */}
      <circle cx={0} cy={0} r={7} fill={color} stroke="#0f172a" strokeWidth="1.2" />
    </g>
  );
}
