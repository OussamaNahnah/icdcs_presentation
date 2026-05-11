import { SlideFrame } from "../SlideFrame";

const EXPLORATION_URL = "https://bramas.fr/static/ICDCN2021/2-robots-3-colors-range-1.html";

export default function SlideExploration() {
  return (
    <SlideFrame eyebrow="Exploration" title="Perpetual Exploration — Algorithm 1">
      <div className="mx-auto w-[620px] max-w-full">
        <div className="relative h-[400px]">
          <iframe
            title="2 robots 3 colors range 1 exploration"
            src={EXPLORATION_URL}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="pointer-events-none absolute right-0 top-0 w-[340px] rounded-2xl border rule bg-white p-5 text-slide-ink shadow-soft">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] ink-soft">Algorithm Used</div>
            <p className="mt-2 text-sm leading-relaxed">
              Optimal exclusive perpetual grid exploration by luminous myopic opaque robots with common chirality
              <span className="ml-1 font-mono text-xs ink-soft">[1]</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border rule bg-slide-accent-soft/40 px-3 py-1 text-xs font-semibold">2 robots</span>
              <span className="rounded-full border rule bg-slide-accent-soft/40 px-3 py-1 text-xs font-semibold">visibility 1</span>
              <span className="rounded-full border rule bg-slide-accent-soft/40 px-3 py-1 text-xs font-semibold">3 colors</span>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
