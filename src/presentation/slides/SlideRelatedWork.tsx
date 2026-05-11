import { SlideFrame } from "../SlideFrame";
import { TwoColumn } from "../primitives/TwoColumn";

export default function SlideRelatedWork() {
  return (
    <SlideFrame eyebrow="Literature" title="Related Work">
      <TwoColumn
        ratio="1:1"
        left={
          <div className="rounded-2xl border rule bg-slide-bg/60 p-6 shadow-soft">
            <h3 className="font-display text-2xl font-semibold text-slide-ink">Synthesis of Algorithms</h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed ink-soft">
              <p>
                <span className="font-semibold text-slide-ink">By hand:</span> manual design of local rules from intuition and
                case analysis.
              </p>
              <p>
                <span className="font-semibold text-slide-ink">With game theory:</span> strategy-based modelling to derive stable
                local decisions.
              </p>
            </div>
          </div>
        }
        right={
          <div className="rounded-2xl border rule bg-slide-bg/60 p-6 shadow-soft">
            <h3 className="font-display text-2xl font-semibold text-slide-ink">Validation Method</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed ink-soft">
              <li>First: simulation-based validation on representative instances.</li>
              <li>
                Second: formal verification with a <span className="font-semibold text-slide-ink">proof assistant</span>.
              </li>
            </ol>
          </div>
        }
      />
    </SlideFrame>
  );
}