import { SlideFrame } from "../SlideFrame";

const NODE_R = 6;

function Node({
  x,
  y,
  filled = false,
  neighbor = false,
  boundary = false,
}: {
  x: number;
  y: number;
  filled?: boolean;
  neighbor?: boolean;
  boundary?: boolean;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r={NODE_R}
      fill={boundary ? "#111827" : filled ? "#3b82f6" : neighbor ? "#ef4444" : "#f8fafc"}
      stroke="#111827"
      strokeWidth="1.6"
    />
  );
}

function FiniteGridDiagram() {
  const cols = 6;
  const rows = 6;
  const step = 32;
  const ox = 30;
  const oy = 22;

  return (
    <svg viewBox="0 0 260 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: cols }).map((_, c) => (
        <line
          key={`v-${c}`}
          x1={ox + c * step}
          y1={oy}
          x2={ox + c * step}
          y2={oy + (rows - 1) * step}
          stroke="#111827"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      ))}
      {Array.from({ length: rows }).map((_, r) => (
        <line
          key={`h-${r}`}
          x1={ox}
          y1={oy + r * step}
          x2={ox + (cols - 1) * step}
          y2={oy + r * step}
          stroke="#111827"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      ))}

      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const onBoundary = r === 0 || c === 0 || r === rows - 1 || c === cols - 1;
          const active = r === 3 && c === 3;
          const neighbor = r === 3 && c === 4;
          return (
            <Node
              key={`n-${r}-${c}`}
              x={ox + c * step}
              y={oy + r * step}
              filled={active}
              neighbor={neighbor}
              boundary={onBoundary}
            />
          );
        })
      )}
    </svg>
  );
}

function InfiniteGridDiagram() {
  const cols = 4;
  const rows = 4;
  const step = 36;
  const ox = 62;
  const oy = 52;

  return (
    <svg viewBox="0 0 260 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: cols }).map((_, c) => {
        const x = ox + c * step;
        return (
          <line
            key={`v-${c}`}
            x1={x}
            y1={20}
            x2={x}
            y2={198}
            stroke="#111827"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        );
      })}
      {Array.from({ length: rows }).map((_, r) => {
        const y = oy + r * step;
        return (
          <line
            key={`h-${r}`}
            x1={20}
            y1={y}
            x2={240}
            y2={y}
            stroke="#111827"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        );
      })}

      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const active = r === 2 && c === 2;
          const neighbor = r === 2 && c === 3;
          return <Node key={`n-${r}-${c}`} x={ox + c * step} y={oy + r * step} filled={active} neighbor={neighbor} />;
        })
      )}
    </svg>
  );
}

function TreeDiagram() {
  const edges = [
    [130, 24, 98, 56],
    [130, 24, 164, 56],
    [98, 56, 70, 84],
    [98, 56, 126, 86],
    [164, 56, 194, 90],
    [70, 84, 40, 112],
    [126, 86, 92, 116],
    [194, 90, 166, 118],
    [166, 118, 130, 148],
  ];

  const nodes = [
    [130, 24, false],
    [98, 56, false],
    [164, 56, true],
    [70, 84, false],
    [126, 86, false],
    [194, 90, false],
    [40, 112, false],
    [92, 116, false],
    [166, 118, false],
    [130, 148, false],
  ] as const;

  const oneStepNeighbors = new Set(["194-90"]);

  return (
    <svg viewBox="0 0 260 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {edges.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#111827"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      ))}
      {nodes.map(([x, y, active], i) => (
        <Node key={i} x={x} y={y} filled={active} neighbor={oneStepNeighbors.has(`${x}-${y}`)} />
      ))}
    </svg>
  );
}

function RingDiagram() {
  const cx = 128;
  const cy = 94;
  const r = 72;
  const n = 8;

  return (
    <svg viewBox="0 0 260 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#111827" strokeWidth="1.5" strokeDasharray="2 2" />
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        const neighbor = i === 2;
        return <Node key={i} x={x} y={y} filled={i === 1} neighbor={neighbor} />;
      })}
    </svg>
  );
}

function LineDiagram() {
  const y = 86;
  const step = 34;
  const start = 32;
  const n = 6;

  return (
    <svg viewBox="0 0 260 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <line
        x1={start}
        y1={y}
        x2={start + (n - 1) * step}
        y2={y}
        stroke="#111827"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      {Array.from({ length: n }).map((_, i) => (
        <Node key={i} x={start + i * step} y={y} filled={i === 3} neighbor={i === 4} />
      ))}
    </svg>
  );
}

function TopologyCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="h-[11rem] w-[14rem]">{children}</div>
      <div className="mt-1 text-2xl font-medium text-slide-ink">{title}</div>
    </div>
  );
}

export default function SlideEnvironment() {
  return (
    <SlideFrame eyebrow="Model" title="Topologies">
      <div className="flex h-full flex-col items-center justify-between">
        <div className="grid w-full max-w-5xl grid-cols-3 gap-x-6 gap-y-4">
          <TopologyCard title="Finite grid">
            <FiniteGridDiagram />
          </TopologyCard>
          <TopologyCard title="Infinite grid">
            <InfiniteGridDiagram />
          </TopologyCard>
          <TopologyCard title="tree">
            <TreeDiagram />
          </TopologyCard>
          <TopologyCard title="ring">
            <RingDiagram />
          </TopologyCard>
          <TopologyCard title="line">
            <LineDiagram />
          </TopologyCard>
        </div>
      </div>
    </SlideFrame>
  );
}
