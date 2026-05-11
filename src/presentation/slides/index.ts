import { ComponentType } from "react";
import SlideTitle from "./SlideTitle";
import SlideAbstract from "./SlideAbstract";
import SlideEnvironment from "./SlideEnvironment";
import SlideAlgorithm from "./SlideAlgorithm";
import SlideIntroduction from "./SlideIntroduction";
import SlideContributions, { contributionsSteps } from "./SlideContributions";
import SlideMethodology, { methodologySteps } from "./SlideMethodology";
import SlideExploration from "./SlideExploration";
import SlideRelatedWork from "./SlideRelatedWork";
import SlideSimulation from "./SlideSimulation";
import SlideResults from "./SlideResults";
import SlideConclusion, { conclusionSteps } from "./SlideConclusion";
import SlideReferences from "./SlideReferences";

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
    steps: 5,
    notes:
      "Introduce the robot model: anonymous, oblivious, luminous, autonomous, heterogeneous. Each robot carries a persistent light visible to neighbours. Walk through one full LCM round — Look (observe neighbourhood), Compute (decide next move from light state), Move (act). Use the simulation to show it live.",
  },
  {
    id: "environment",
    title: "Environment",
    component: SlideEnvironment,
    steps: 1,
    notes:
      "Present common graph topologies used in swarm models: finite grid, infinite grid, tree, ring, and line. Emphasize that the same robot protocol can be studied under different underlying environments.",
  },
  {
    id: "algorithm",
    title: "Algorithm",
    component: SlideAlgorithm,
    steps: 5,
    notes:
      "Explain how local rules map a perceived view to a unique action. Walk Rule 1 and Rule 2 examples, then point to the grid instance to show how a robot applies the rule and obtains a deterministic movement direction.",
  },
  {
    id: "exploration",
    title: "Exploration",
    component: SlideExploration,
    steps: 1,
    notes:
      "Use the embedded external simulator (2 robots, 3 colors, visibility range 1) to explore how local color/state updates produce coordinated movement. If embedding is blocked, open it in a separate tab from the slide button.",
  },
  {
    id: "related-work",
    title: "Related Work",
    component: SlideRelatedWork,
    steps: 1,
    notes:
      "Position prior approaches in two buckets: algorithm synthesis (manual and game-theoretic) and validation methods, where proof assistants provide formal guarantees beyond simulation.",
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
  {
    id: "references",
    title: "References",
    component: SlideReferences,
    steps: 1,
    notes:
      "Cite Bramas et al. (TCS 2023) as the source for Algorithm 1 and keep the external demonstration URL available for reproducibility.",
  },
];
