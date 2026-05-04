
# Scientific Presentation System — Swarm Robotics Paper

A modular, responsive React + TypeScript presentation platform. Each slide is its own component file. Built around a fixed 1920×1080 design canvas that scales to any viewport, with a true responsive reading mode on tablet/mobile (stacked, single‑column) instead of just shrinking the deck.

## Look & feel

- Clean academic style: white background, soft blue/gray accents, subtle shadows, generous whitespace.
- Inter (system fallback) for body, slightly tighter display weight for headings.
- Smooth slide transitions and step‑in animations via Framer Motion.
- Light/dark toggle.

## Architecture

```text
src/
  presentation/
    PresentationApp.tsx        # shell: routes between editor / present / overview
    SlideStage.tsx             # 1920x1080 scaled canvas (desktop)
    ResponsiveSlide.tsx        # stacked single-column rendering (tablet/mobile)
    SlideFrame.tsx             # shared chrome: title, footer, step context
    useSlideController.ts      # zustand store: index, step, mode, notes visibility
    navigation/
      ProgressBar.tsx
      SideNav.tsx
      OverviewGrid.tsx
      PresenterView.tsx        # current + next + notes + timer
    primitives/
      TwoColumn.tsx            # text | visual layout, collapses on mobile
      StepReveal.tsx           # framer-motion step-based reveal
      EmbedFrame.tsx           # resizable/draggable iframe wrapper
      FigureCaption.tsx
    slides/
      index.ts                 # ordered slide registry + metadata + notes
      SlideTitle.tsx
      SlideAbstract.tsx
      SlideIntroduction.tsx
      SlideContributions.tsx
      SlideMethodology.tsx
      SlideSimulation.tsx
      SlideResults.tsx
      SlideConclusion.tsx
    simulation/
      SwarmSimulation.tsx      # scripted grid demo
      scenario.ts              # step-by-step robot positions + obstacle
  pages/Index.tsx              # mounts PresentationApp
```

Slides are registered in `slides/index.ts` as `{ id, component, title, notes, steps }`. Reordering = reorder the array. Adding a slide = drop a new file and append to the registry.

## Responsive strategy

- Desktop ≥1024px: scaled 1920×1080 stage, two‑column layouts, full chrome.
- Tablet 640–1024px: stage abandoned; `ResponsiveSlide` renders the same slide content stacked, larger tap targets, side nav becomes bottom progress bar.
- Mobile <640px: single column, collapsible section headers, swipe + on‑screen prev/next.

Each slide component exports both a `Stage` render (absolute positions ok) and a `Flow` render (semantic stacked blocks). `TwoColumn` and `StepReveal` handle this automatically so most slides only write content once.

## Navigation & controls

- Keyboard: ←/→ or Space steps through reveals then slides; `O` overview; `P` presenter; `F` fullscreen; `N` toggle notes.
- Bottom progress bar with slide index `4 / 8` and step dots.
- Collapsible left side nav with slide titles, click to jump.
- Overview mode: grid of scaled thumbnails, click to enter.
- Presenter mode: current slide + next preview + notes + elapsed timer, opens in same window (toggle), no second‑window sync needed.

## Slide content

1. **SlideTitle** — paper title, four authors with affiliations, venue placeholder, subtle animated dots motif suggesting a swarm.
2. **SlideAbstract** — full abstract text, key terms highlighted (luminous robots, LCM, synthesis, proof) with a small static grid graphic.
3. **SlideIntroduction** — swarm robotics context, LCM cycle diagram (Look → Compute → Move) animated as a loop, luminous‑robot color states, distributed design challenges as bullet reveals.
4. **SlideContributions** — five reveal cards: hybrid method, synthesis pipeline, simulation filtering, energy‑based selection, inductive proof extension, classification.
5. **SlideMethodology** — horizontal 5‑step pipeline (extend → synthesize → filter → prove → classify), each step reveals on space, with a short caption.
6. **SlideSimulation** — interactive scripted grid demo:
   - Fixed grid (e.g. 12×8), obstacle block, 4–6 colored robots.
   - Pre‑authored sequence in `scenario.ts`: each step = robot positions + lights.
   - Controls: play/pause, step forward/back, restart, speed slider.
   - Legend explaining light colors.
7. **SlideResults** — generated‑algorithm count, comparison table, classification criteria, simple bar chart (Recharts) for energy/length distributions (mock numbers labeled as illustrative).
8. **SlideConclusion** — generic method recap, scalability note, future work bullets, thank‑you / contact line.

Each slide ships with presenter notes co‑located in its file.

## Animation system

- Slide transitions: 250ms cross‑fade + 8px slide.
- In‑slide steps: `StepReveal` reads current step from the store and animates children with stagger.
- Reduced‑motion respected via `prefers-reduced-motion`.

## Embeds

`EmbedFrame` wraps any iframe or component with:
- Resize handle (corner drag) clamped to slide bounds.
- Optional drag to reposition (desktop only).
- Falls back to natural block flow on mobile (no drag/resize).

## Out of scope (per your answers)

- No in‑app slide editing or backend persistence — slides are edited as code.
- No full LCM engine — simulation is a scripted scenario.
- No deep links, autoplay, or overview search in v1 (easy to add later).

## Technical notes

- Stack: React 18 + TS + Tailwind + Framer Motion + Zustand + Recharts (already compatible with project).
- All colors via Tailwind tokens defined in `index.css` (HSL), including new `--slide-*` tokens for accent/grid/robot colors with light + dark variants.
- Fixed‑canvas scaling: `transform: scale(min(vw/1920, vh/1080))` on an absolutely centered 1920×1080 wrapper; switched off below the `lg` breakpoint where `ResponsiveSlide` takes over.
- Fullscreen via the Fullscreen API with cleanup on `fullscreenchange`.
- `Index.tsx` becomes a thin mount of `PresentationApp`.
