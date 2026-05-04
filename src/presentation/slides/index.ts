import { ComponentType } from "react";
import SlideTitle from "./SlideTitle";
import SlideAbstract from "./SlideAbstract";
import SlideIntroduction from "./SlideIntroduction";
import SlideContributions, { contributionsSteps } from "./SlideContributions";
import SlideMethodology, { methodologySteps } from "./SlideMethodology";
import SlideSimulation from "./SlideSimulation";
import SlideResults from "./SlideResults";
import SlideConclusion, { conclusionSteps } from "./SlideConclusion";

export interface SlideEntry {
  id: string;
  title: string;
  component: ComponentType;
  /** Number of step reveals inside the slide (default 1 = no internal steps) */
  steps: number;
  notes: string;
}

export const slides: SlideEntry[] = [
  {
    id: "title",
    title: "Title",
    component: SlideTitle,
    steps: 1,
    notes:
      "Welcome — paper joint with Geneva and Clermont Auvergne. Give the audience a sense of the problem in one sentence: synthesizing distributed algorithms so a swarm of identical robots can navigate around an obstacle.",
  },
  {
    id: "abstract",
    title: "Model",
    component: SlideAbstract,
    steps: 6,
    notes:
      "Introduce the robot model: anonymous, oblivious, luminous, autonomous, heterogeneous. Each robot carries a persistent light visible to neighbours. Walk through one full LCM round — Look (observe neighbourhood), Compute (decide next move from light state), Move (act). Use the simulation to show it live.",
  },
  {
    id: "introduction",
    title: "Introduction",
    component: SlideIntroduction,
    steps: 3,
    notes:
      "Build it up: (1) what a swarm is, (2) why luminous lights matter — only persistent memory, (3) the design challenge of writing local rules that yield a correct global behaviour for any size.",
  },
  {
    id: "contributions",
    title: "Contributions",
    component: SlideContributions,
    steps: contributionsSteps,
    notes:
      "Reveal the cards one by one. Emphasize that our method is hybrid (automation + human insight) and ends with a classification, not just one algorithm.",
  },
  {
    id: "methodology",
    title: "Methodology",
    component: SlideMethodology,
    steps: methodologySteps,
    notes:
      "Walk the pipeline left to right: extend, synthesize, filter, prove, classify. Stress that simulation is a cheap necessary condition; the proof is the sufficient one.",
  },
  {
    id: "simulation",
    title: "Simulation",
    component: SlideSimulation,
    steps: 1,
    notes:
      "Demo time. Press play. Highlight the LCM phases: cyan = looking, then compute (amber/violet roles), then synchronous moves. End on emerald = goal reached.",
  },
  {
    id: "results",
    title: "Results",
    component: SlideResults,
    steps: 1,
    notes:
      "Funnel from ~12k candidates to 45 proven algorithms in 7 behaviour classes. Numbers are illustrative; we can quote the real ones from the paper.",
  },
  {
    id: "conclusion",
    title: "Conclusion",
    component: SlideConclusion,
    steps: conclusionSteps,
    notes:
      "Wrap-up: the method is generic, scales by construction, and there is plenty of future work (multiple obstacles, async schedulers, fault tolerance).",
  },
];
