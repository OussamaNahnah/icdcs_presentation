import { Boxes, Filter, Gauge, ListTree, ShieldCheck, Wand2 } from "lucide-react";
import { SlideFrame } from "../SlideFrame";
import { StepReveal } from "../primitives/StepReveal";

const cards = [
  {
    icon: Wand2,
    title: "Hybrid method",
    body: "Combine automated synthesis with manual generalisation — get the best of both worlds.",
  },
  {
    icon: Boxes,
    title: "Synthesis pipeline",
    body: "Enumerate candidate transition rules over the luminous-robot state space.",
  },
  {
    icon: Filter,
    title: "Simulation filtering",
    body: "Discard candidates that fail on a battery of representative grids.",
  },
  {
    icon: Gauge,
    title: "Energy-based selection",
    body: "Rank survivors by total moves and lights changed — keep the cheapest.",
  },
  {
    icon: ShieldCheck,
    title: "Inductive proof extension",
    body: "Lift correctness from small grids to arbitrary dimensions by induction.",
  },
  {
    icon: ListTree,
    title: "Algorithm classification",
    body: "Group equivalent solutions by behaviour and required light alphabet.",
  },
];

export default function SlideContributions() {
  return (
    <SlideFrame eyebrow="Contributions" title="What we add to the picture">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <StepReveal key={c.title} at={i}>
            <div className="h-full rounded-2xl border rule bg-slide-bg/60 p-5 shadow-soft transition-shadow hover:shadow-card">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slide-accent-soft text-slide-accent">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-xl font-semibold text-slide-ink">
                {c.title}
              </div>
              <p className="mt-2 text-sm ink-soft leading-relaxed">{c.body}</p>
            </div>
          </StepReveal>
        ))}
      </div>
    </SlideFrame>
  );
}

export const contributionsSteps = 6;
