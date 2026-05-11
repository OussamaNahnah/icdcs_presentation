import { SlideFrame } from "../SlideFrame";

const EXPLORATION_URL = "/2-robots-3-colors-range-1.html";

export default function SlideExploration() {
  return (
    <SlideFrame eyebrow="Exploration" title="Perpetual Exploration — Algorithm 1">
      <div className="mx-auto w-[580px] max-w-full">
        <div className="relative h-[440px] overflow-hidden">
          <iframe
            title="2 robots 3 colors range 1 exploration"
            src={EXPLORATION_URL}
            className="h-[730px] w-full -translate-y-[128px]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </SlideFrame>
  );
}
