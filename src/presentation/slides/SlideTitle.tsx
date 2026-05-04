import { motion } from "framer-motion";
import { SlideFrame } from "../SlideFrame";

const authors = [
  { name: "Karine Altisen", aff: "Université de Genève, Switzerland" },
  { name: "Anaïs Durand", aff: "Université Clermont Auvergne, France" },
  { name: "Pascal Lafourcade", aff: "Université Clermont Auvergne, France" },
  { name: "Oussama Nahnah", aff: "Université Clermont Auvergne, France" },
];

export default function SlideTitle() {
  return (
    <SlideFrame bare className="!p-0">
      <div className="relative h-full w-full overflow-hidden">
        {/* Decorative swarm dots */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 28 }).map((_, i) => {
            const top = (i * 37) % 100;
            const left = (i * 53) % 100;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.35, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.6 }}
                className="absolute h-1.5 w-1.5 rounded-full bg-slide-accent"
                style={{ top: `${top}%`, left: `${left}%` }}
              />
            );
          })}
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-10 sm:px-12 sm:py-14 lg:px-24 lg:py-20">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] ink-soft">
              Distributed Computing · Swarm Robotics
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl"
          >
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] text-slide-ink">
              Synthesizing Algorithms to Avoid an Obstacle
              <span className="text-slide-accent"> with a Swarm of Robots</span>
            </h1>
            <div className="mt-6 h-1 w-24 bg-slide-accent" />
          </motion.div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 max-w-3xl">
            {authors.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
              >
                <div className="font-medium text-slide-ink">{a.name}</div>
                <div className="text-sm ink-soft">{a.aff}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
