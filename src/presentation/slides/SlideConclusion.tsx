import { Sparkles, Scaling, Telescope } from "lucide-react";
import { SlideFrame } from "../SlideFrame";
import { StepReveal } from "../primitives/StepReveal";

const blocks = [
  {
    icon: Sparkles,
    title: "A generic method",
    body: "Synthesis + simulation + induction generalises beyond obstacle avoidance to other swarm problems.",
  },
  {
    icon: Scaling,
    title: "Scales by construction",
    body: "Proofs are parametric in the grid size — once verified, an algorithm runs on any rectangle.",
  },
  {
    icon: Telescope,
    title: "Future work",
    body: "Multiple obstacles, asynchronous schedulers, fault tolerance, and continuous-space variants.",
  },
];

export default function SlideConclusion() {
  return (
    <SlideFrame eyebrow="Conclusion" title="Where this leaves us">
      <div className="flex h-full flex-col justify-between gap-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {blocks.map((b, i) => (
            <StepReveal key={b.title} at={i}>
              <div className="h-full rounded-2xl border rule bg-slide-bg/60 p-6 shadow-soft">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slide-accent-soft text-slide-accent">
                  <b.icon className="h-5 w-5" />
                </div>
                <div className="font-display text-xl font-semibold text-slide-ink">
                  {b.title}
                </div>
                <p className="mt-2 text-base ink-soft leading-relaxed">{b.body}</p>
              </div>
            </StepReveal>
          ))}
        </div>

        <StepReveal at={3}>
          <div className="rounded-2xl border rule bg-slide-accent-soft/60 p-6 sm:p-8 text-center">
            <div className="font-display text-2xl sm:text-3xl text-slide-ink">
              Thank you — questions welcome.
            </div>
            <div className="mt-2 ink-soft text-sm">
              Altisen · Durand · Lafourcade · Nahnah
            </div>
          </div>
        </StepReveal>
      </div>
    </SlideFrame>
  );
}

export const conclusionSteps = 4;
