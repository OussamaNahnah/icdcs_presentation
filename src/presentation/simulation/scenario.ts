export type Cell = { x: number; y: number };

export type LightColor = "off" | "cyan" | "amber" | "rose" | "violet" | "emerald";

export interface RobotSnapshot {
  id: string;
  pos: Cell;
  light: LightColor;
}

export interface Step {
  /** Phase label shown in the controls */
  phase: "Look" | "Compute" | "Move" | "Init" | "Done";
  /** Human-readable description shown under the grid */
  caption: string;
  robots: RobotSnapshot[];
}

export const GRID = { cols: 13, rows: 8 };

/** Static obstacle (a small wall the swarm needs to navigate around) */
export const OBSTACLE: Cell[] = [
  { x: 6, y: 3 },
  { x: 6, y: 4 },
  { x: 7, y: 3 },
  { x: 7, y: 4 },
];

/**
 * Scripted scenario: 4 luminous robots starting on the left, exploring
 * around an obstacle to reach the right side. Each step advances the
 * Look-Compute-Move cycle (LCM model).
 */
export const SCENARIO: Step[] = [
  {
    phase: "Init",
    caption: "Four luminous robots are deployed on the left. Lights are off.",
    robots: [
      { id: "r1", pos: { x: 1, y: 1 }, light: "off" },
      { id: "r2", pos: { x: 1, y: 3 }, light: "off" },
      { id: "r3", pos: { x: 1, y: 5 }, light: "off" },
      { id: "r4", pos: { x: 1, y: 6 }, light: "off" },
    ],
  },
  {
    phase: "Look",
    caption: "Each robot snapshots the configuration; an obstacle is detected ahead.",
    robots: [
      { id: "r1", pos: { x: 1, y: 1 }, light: "cyan" },
      { id: "r2", pos: { x: 1, y: 3 }, light: "cyan" },
      { id: "r3", pos: { x: 1, y: 5 }, light: "cyan" },
      { id: "r4", pos: { x: 1, y: 6 }, light: "cyan" },
    ],
  },
  {
    phase: "Compute",
    caption: "Robots compute a side: outer rows go straight, inner rows split up/down.",
    robots: [
      { id: "r1", pos: { x: 1, y: 1 }, light: "amber" },
      { id: "r2", pos: { x: 1, y: 3 }, light: "violet" },
      { id: "r3", pos: { x: 1, y: 5 }, light: "violet" },
      { id: "r4", pos: { x: 1, y: 6 }, light: "amber" },
    ],
  },
  {
    phase: "Move",
    caption: "Synchronous move: one cell to the right.",
    robots: [
      { id: "r1", pos: { x: 2, y: 1 }, light: "amber" },
      { id: "r2", pos: { x: 2, y: 3 }, light: "violet" },
      { id: "r3", pos: { x: 2, y: 5 }, light: "violet" },
      { id: "r4", pos: { x: 2, y: 6 }, light: "amber" },
    ],
  },
  {
    phase: "Move",
    caption: "Inner robots steer away from the obstacle row.",
    robots: [
      { id: "r1", pos: { x: 3, y: 1 }, light: "amber" },
      { id: "r2", pos: { x: 3, y: 2 }, light: "violet" },
      { id: "r3", pos: { x: 3, y: 6 }, light: "violet" },
      { id: "r4", pos: { x: 3, y: 6 }, light: "amber" },
    ],
  },
  {
    phase: "Move",
    caption: "Approaching the obstacle on safe rows.",
    robots: [
      { id: "r1", pos: { x: 4, y: 1 }, light: "amber" },
      { id: "r2", pos: { x: 4, y: 2 }, light: "violet" },
      { id: "r3", pos: { x: 4, y: 6 }, light: "violet" },
      { id: "r4", pos: { x: 5, y: 6 }, light: "amber" },
    ],
  },
  {
    phase: "Move",
    caption: "Skirting the obstacle.",
    robots: [
      { id: "r1", pos: { x: 6, y: 1 }, light: "amber" },
      { id: "r2", pos: { x: 6, y: 2 }, light: "violet" },
      { id: "r3", pos: { x: 6, y: 6 }, light: "violet" },
      { id: "r4", pos: { x: 7, y: 6 }, light: "amber" },
    ],
  },
  {
    phase: "Move",
    caption: "Past the obstacle, robots converge back toward the median row.",
    robots: [
      { id: "r1", pos: { x: 8, y: 2 }, light: "rose" },
      { id: "r2", pos: { x: 8, y: 3 }, light: "rose" },
      { id: "r3", pos: { x: 8, y: 5 }, light: "rose" },
      { id: "r4", pos: { x: 9, y: 5 }, light: "rose" },
    ],
  },
  {
    phase: "Move",
    caption: "Final straight line toward the right border.",
    robots: [
      { id: "r1", pos: { x: 10, y: 2 }, light: "rose" },
      { id: "r2", pos: { x: 10, y: 3 }, light: "rose" },
      { id: "r3", pos: { x: 10, y: 5 }, light: "rose" },
      { id: "r4", pos: { x: 11, y: 5 }, light: "rose" },
    ],
  },
  {
    phase: "Done",
    caption: "Goal reached — obstacle avoided, no collisions.",
    robots: [
      { id: "r1", pos: { x: 11, y: 2 }, light: "emerald" },
      { id: "r2", pos: { x: 11, y: 3 }, light: "emerald" },
      { id: "r3", pos: { x: 11, y: 5 }, light: "emerald" },
      { id: "r4", pos: { x: 12, y: 5 }, light: "emerald" },
    ],
  },
];
