import { ArrowRight } from "lucide-react";
import { SlideFrame } from "../SlideFrame";
import { StepReveal } from "../primitives/StepReveal";

const steps = [
  { n: "01", title: "Extend base algorithm", body: "Start from a known obstacle-free solver and add light states for obstacle awareness." },
  { n: "02", title: "Guided synthesis", body: "Enumerate transition rules constrained by symmetry and locality." },
  { n: "03", title: "Simulation filtering", body: "Run thousands of candidates on a benchmark of grids; keep those that always succeed." },
  { n: "04", title: "Proof generalisation", body: "Lift small-grid correctness to arbitrary sizes by structural induction." },
  { n: "05", title: "Classification", body: "Cluster surviving algorithms by behaviour, light alphabet, and energy cost." },
];

export default function SlideMethodology() {
  return (
    <SlideFrame eyebrow="Methodology" title="A five-stage pipeline">
      <div className="flex h-full flex-col justify-center">
        <div className="hidden lg:flex items-stretch gap-3">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-stretch gap-3 flex-1 last:flex-1">
              <StepReveal at={i} className="flex-1">
                <div className="h-full rounded-2xl border rule bg-slide-bg/60 p-5 shadow-soft">
                  <div className="font-mono text-xs ink-soft">{s.n}</div>
                  <div className="mt-2 font-display text-lg font-semibold text-slide-ink">
                    {s.title}
                  </div>
                  <p className="mt-2 text-sm ink-soft leading-relaxed">{s.body}</p>
                </div>
              </StepReveal>
              {i < steps.length - 1 && (
                <div className="flex items-center text-slide-accent">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stacked on mobile/tablet */}
        <div className="flex lg:hidden flex-col gap-3">
          {steps.map((s, i) => (
            <StepReveal key={s.n} at={i}>
              <div className="rounded-2xl border rule bg-slide-bg/60 p-5 shadow-soft">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs ink-soft">{s.n}</span>
                  <div className="font-display text-lg font-semibold text-slide-ink">
                    {s.title}
                  </div>
                </div>
                <p className="mt-2 text-sm ink-soft leading-relaxed">{s.body}</p>
              </div>
            </StepReveal>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

export const methodologySteps = 5;
