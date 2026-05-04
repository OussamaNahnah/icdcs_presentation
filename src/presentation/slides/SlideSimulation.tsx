import { SlideFrame } from "../SlideFrame";
import { TwoColumn } from "../primitives/TwoColumn";
import { SwarmSimulation } from "../simulation/SwarmSimulation";

export default function SlideSimulation() {
  return (
    <SlideFrame eyebrow="Live simulation" title="Watch the swarm avoid the obstacle">
      <TwoColumn
        ratio="3:2"
        right={
          <div className="space-y-4 text-base text-slide-ink">
            <p>
              Four luminous robots, deployed on the left, must reach the right
              border of the grid while avoiding a static obstacle in the middle.
            </p>
            <p className="ink-soft">
              At each round all robots execute Look → Compute → Move
              simultaneously. Lights encode the role each robot has computed
              for itself.
            </p>
            <ul className="text-sm ink-soft space-y-1.5">
              <li>· Use <span className="font-mono">▶</span> to play, or step manually.</li>
              <li>· Adjust speed with the slider.</li>
              <li>· No global coordinator — purely local rules.</li>
            </ul>
          </div>
        }
        left={
          <div className="h-[420px] sm:h-[480px] lg:h-[560px]">
            <SwarmSimulation />
          </div>
        }
      />
    </SlideFrame>
  );
}
