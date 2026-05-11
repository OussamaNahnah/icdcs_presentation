import { ExternalLink } from "lucide-react";
import { SlideFrame } from "../SlideFrame";

const PAPER_URL = "https://doi.org/10.1016/j.tcs.2023.114162";
const WEB_DEMO_URL = "/2-robots-3-colors-range-1.html";

const REFERENCES = [
  {
    id: 1,
    text: "Bramas, Lafourcade, Devismes (2023). Optimal exclusive perpetual grid exploration by luminous myopic opaque robots with common chirality. DOI: 10.1016/j.tcs.2023.114162",
    url: PAPER_URL,
  },
  {
    id: 2,
    text: "\"Optimal exclusive perpetual grid exploration by luminous myopic opaque robots with common chirality\": algorithm example with 2 robots, visibility range 1, 3 colors.",
    url: PAPER_URL,
  },
  {
    id: 3,
    text: "Interactive demo page for the 2 robots / 3 colors / range 1 setting.",
    url: WEB_DEMO_URL,
  },
];

export default function SlideReferences() {
  return (
    <SlideFrame eyebrow="References" title="References">
      <div className="rounded-xl border rule bg-slide-bg/50 p-5">
        <ol className="space-y-3">
          {REFERENCES.map((ref) => (
            <li key={ref.id} id={`ref-${ref.id}`} className="text-sm leading-relaxed text-slide-ink">
              <span className="mr-2 font-mono ink-soft">[{ref.id}]</span>
              <span>{ref.text}</span>
              <a
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="ml-3 inline-flex items-center gap-1 text-xs font-semibold text-slide-accent hover:underline"
              >
                Open ref [{ref.id}]
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </SlideFrame>
  );
}
