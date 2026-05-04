import { motion } from "framer-motion";
import { Eye, Cpu, MoveRight } from "lucide-react";
import { SlideFrame } from "../SlideFrame";
import { TwoColumn } from "../primitives/TwoColumn";
import { StepReveal } from "../primitives/StepReveal";

const cycle = [
  { label: "Look", icon: Eye, desc: "Snapshot of visible neighbours and lights" },
  { label: "Compute", icon: Cpu, desc: "Pure function of the snapshot → next light + move" },
  { label: "Move", icon: MoveRight, desc: "Atomic move to an adjacent cell" },
];

export default function SlideIntroduction() {
  return (
    <SlideFrame eyebrow="Introduction" title="Swarms, lights, and the LCM model">
      <TwoColumn
        ratio="5:7"
        left={
          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-slide-ink">
            <StepReveal at={0}>
              <p>
                A <strong>swarm</strong> is a large set of identical, simple
                robots cooperating to solve a global task — covering, gathering,
                exploring — without a leader.
              </p>
            </StepReveal>
            <StepReveal at={1}>
              <p>
                In the <strong>luminous robots</strong> model, each robot carries
                a tiny persistent light. Lights are the only memory the system
                has between rounds, and they are visible to neighbours.
              </p>
            </StepReveal>
            <StepReveal at={2}>
              <p>
                The challenge: design <strong>local rules</strong> that, when
                executed in lock-step by every robot, yield a correct global
                behaviour — for arbitrarily many robots and arbitrarily large
                grids.
              </p>
            </StepReveal>
          </div>
        }
        right={
          <div className="rounded-2xl border rule bg-slide-bg/60 p-6 shadow-soft">
            <div className="font-mono text-xs uppercase tracking-widest ink-soft mb-5">
              The LCM cycle
            </div>
            <div className="flex items-stretch justify-between gap-3">
              {cycle.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.15 }}
                  className="flex-1 rounded-xl border rule p-4 bg-slide-surface text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slide-accent-soft text-slide-accent">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-lg font-semibold">{c.label}</div>
                  <div className="mt-1 text-xs ink-soft">{c.desc}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 text-xs ink-soft text-center">
              ↻ repeated synchronously every round
            </div>
          </div>
        }
      />
    </SlideFrame>
  );
}
