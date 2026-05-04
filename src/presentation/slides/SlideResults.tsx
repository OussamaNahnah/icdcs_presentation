import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SlideFrame } from "../SlideFrame";
import { TwoColumn } from "../primitives/TwoColumn";

const energyData = [
  { lights: "2", count: 4 },
  { lights: "3", count: 11 },
  { lights: "4", count: 19 },
  { lights: "5", count: 8 },
  { lights: "6+", count: 3 },
];

const stats = [
  { label: "Candidates enumerated", value: "≈ 12,400" },
  { label: "Passed simulation filter", value: "187" },
  { label: "Proven correct (any grid)", value: "45" },
  { label: "Distinct behaviour classes", value: "7" },
];

export default function SlideResults() {
  return (
    <SlideFrame eyebrow="Results" title="From thousands of candidates to a handful of algorithms">
      <TwoColumn
        ratio="5:7"
        left={
          <div className="space-y-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between rounded-xl border rule bg-slide-bg/60 p-4 shadow-soft"
              >
                <span className="text-sm ink-soft">{s.label}</span>
                <span className="font-display text-2xl font-semibold text-slide-ink">
                  {s.value}
                </span>
              </div>
            ))}
            <p className="text-xs ink-soft pt-2">
              Numbers are illustrative of the pipeline's funnel shape.
            </p>
          </div>
        }
        right={
          <div className="h-full rounded-2xl border rule bg-slide-bg/60 p-5 shadow-soft">
            <div className="mb-3 flex items-baseline justify-between">
              <div className="font-display text-lg font-semibold text-slide-ink">
                Algorithms by light-alphabet size
              </div>
              <span className="font-mono text-xs ink-soft">smaller = cheaper</span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyData} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                  <CartesianGrid stroke="hsl(var(--slide-grid-line))" vertical={false} />
                  <XAxis
                    dataKey="lights"
                    stroke="hsl(var(--slide-ink-soft))"
                    fontSize={12}
                    label={{ value: "lights used", position: "insideBottom", offset: -2, fill: "hsl(var(--slide-ink-soft))", fontSize: 11 }}
                  />
                  <YAxis stroke="hsl(var(--slide-ink-soft))" fontSize={12} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--slide-accent-soft))" }}
                    contentStyle={{
                      background: "hsl(var(--slide-surface))",
                      border: "1px solid hsl(var(--slide-rule))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--slide-accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-xs ink-soft">
              Classification criteria: light alphabet, total energy, symmetry class, termination time.
            </div>
          </div>
        }
      />
    </SlideFrame>
  );
}
