import { create } from "zustand";

export type SlideMode = "deck" | "overview" | "presenter";

interface SlideState {
  index: number;
  step: number;
  mode: SlideMode;
  showNotes: boolean;
  totalSlides: number;
  stepsForCurrent: number;

  setTotal: (n: number) => void;
  setStepsForCurrent: (n: number) => void;
  goTo: (i: number, step?: number) => void;
  next: () => void;
  prev: () => void;
  setMode: (m: SlideMode) => void;
  toggleNotes: () => void;
}

export const useSlideController = create<SlideState>((set, get) => ({
  index: 0,
  step: 0,
  mode: "deck",
  showNotes: false,
  totalSlides: 1,
  stepsForCurrent: 1,

  setTotal: (n) => set({ totalSlides: n }),
  setStepsForCurrent: (n) => {
    const steps = Math.max(1, n);
    set((state) => ({
      stepsForCurrent: steps,
      step: Math.min(state.step, steps - 1),
    }));
  },

  goTo: (i, step = 0) => {
    const { totalSlides } = get();
    const clamped = Math.max(0, Math.min(totalSlides - 1, i));
    set({ index: clamped, step });
  },

  next: () => {
    const { index, step, stepsForCurrent, totalSlides } = get();
    if (step < stepsForCurrent - 1) {
      set({ step: step + 1 });
    } else if (index < totalSlides - 1) {
      set({ index: index + 1, step: 0 });
    }
  },

  prev: () => {
    const { index, step } = get();
    if (step > 0) {
      set({ step: step - 1 });
    } else if (index > 0) {
      // Jump to previous slide and let step clamping land on its last internal step.
      set({ index: index - 1, step: Number.MAX_SAFE_INTEGER });
    }
  },

  setMode: (m) => set({ mode: m }),
  toggleNotes: () => set({ showNotes: !get().showNotes }),
}));
