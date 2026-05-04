import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid3x3, Maximize2, Minimize2, Moon, PanelLeftOpen, StickyNote, Sun, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSlideController } from "./useSlideController";
import { slides } from "./slides";
import { ProgressBar } from "./navigation/ProgressBar";
import { SideNav } from "./navigation/SideNav";
import { OverviewGrid } from "./navigation/OverviewGrid";
import { cn } from "@/lib/utils";

export function PresentationApp() {
  const {
    index, mode, showNotes, setTotal, setStepsForCurrent,
    next, prev, setMode, toggleNotes, goTo,
  } = useSlideController();

  const [navOpen, setNavOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 720;
  const autoZoom = () => Math.round(Math.min(window.innerWidth / BASE_WIDTH, window.innerHeight / BASE_HEIGHT) * 100);
  const [fontSize, setFontSize] = useState(autoZoom);

  // Re-compute zoom when window resizes (user can still nudge after)
  useEffect(() => {
    const onResize = () => setFontSize(autoZoom());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const increaseFontSize = () => setFontSize((s) => Math.min(s + 10, 200));
  const decreaseFontSize = () => setFontSize((s) => Math.max(s - 10, 50));

  // Register total slides + per-slide steps
  useEffect(() => { setTotal(slides.length); }, [setTotal]);
  useEffect(() => {
    setStepsForCurrent(slides[index].steps);
  }, [index, setStepsForCurrent]);

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Fullscreen sync
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          goTo(0, 0);
          break;
        case "End":
          goTo(slides.length - 1, 0);
          break;
        case "o":
        case "O":
          setMode(mode === "overview" ? "deck" : "overview");
          break;
        case "n":
        case "N":
          toggleNotes();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "Escape":
          if (mode !== "deck") setMode("deck");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, mode, setMode, toggleNotes, goTo]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  };

  const Slide = slides[index].component;
  const slideMeta = slides[index];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slide-bg text-slide-ink flex flex-col">
      {/* Hover zone — invisible trigger strip at top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-8 z-50 group">
        {/* Floating pill toolbar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border rule bg-slide-bg/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
          <Button
            size="default"
            variant="ghost"
            onClick={() => setNavOpen((o) => !o)}
            title="Toggle outline"
            className={cn("rounded-full", navOpen && "bg-slide-accent-soft text-slide-accent")}
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
          <Button
            size="default"
            variant="ghost"
            onClick={() => setMode("overview")}
            title="Overview (O)"
            className="rounded-full"
          >
            <Grid3x3 className="h-5 w-5" />
          </Button>
          <Button
            size="default"
            variant="ghost"
            onClick={toggleNotes}
            title="Notes (N)"
            className={cn("rounded-full", showNotes && "bg-slide-accent-soft text-slide-accent")}
          >
            <StickyNote className="h-5 w-5" />
          </Button>
          <Button
            size="default"
            variant="ghost"
            onClick={toggleFullscreen}
            title="Fullscreen (F)"
            className="rounded-full"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
          <Button
            size="default"
            variant="ghost"
            onClick={() => setDark((d) => !d)}
            title="Toggle theme"
            className="rounded-full"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            size="default"
            variant="ghost"
            onClick={decreaseFontSize}
            title="Decrease font size"
            className="rounded-full"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            size="default"
            variant="ghost"
            onClick={increaseFontSize}
            title="Increase font size"
            className="rounded-full"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 min-h-0">
        <SideNav open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="relative flex-1 min-h-0 flex flex-col">
          <div className="relative flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideMeta.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-y-auto"
                style={{ zoom: fontSize / 100 }}
              >
                <Slide />
              </motion.div>
            </AnimatePresence>

            {/* Floating prev/next on hover (desktop) */}
            <button
              onClick={prev}
              disabled={index === 0}
              className={cn("hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border rule bg-slide-surface/80 backdrop-blur shadow-soft hover:bg-slide-accent-soft disabled:opacity-30 disabled:cursor-not-allowed transition-all", isFullscreen && "!hidden")}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className={cn("hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border rule bg-slide-surface/80 backdrop-blur shadow-soft hover:bg-slide-accent-soft transition-all", isFullscreen && "!hidden")}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Notes panel */}
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="border-t rule bg-slide-bg/80 backdrop-blur overflow-hidden"
              >
                <div className="px-6 py-4">
                  <div className="font-mono text-xs uppercase tracking-widest ink-soft mb-1.5">
                    Speaker notes — {slideMeta.title}
                  </div>
                  <p className="text-sm leading-relaxed text-slide-ink">{slideMeta.notes}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer / progress + mobile nav */}
          {/* Slide counter — bottom right */}
          <div className="absolute bottom-3 right-4 z-30 font-mono ink-soft select-none pointer-events-none" style={{ fontSize: `${Math.max(10, 12 * fontSize / 100)}px` }}>
            {index + 1}/{slides.length}
          </div>
        </main>
      </div>

      {/* Modal-like modes */}
      {mode === "overview" && <OverviewGrid />}
    </div>
  );
}
