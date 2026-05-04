import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSlideController } from "../useSlideController";
import { slides } from "../slides";
import { cn } from "@/lib/utils";

export function SideNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { index, goTo } = useSlideController();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          ref={panelRef}
          initial={{ x: -260, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -260, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 bottom-0 z-20 hidden lg:flex flex-col w-64 border-r rule bg-slide-bg/90 backdrop-blur-sm shadow-lg"
        >
          <div className="h-12 flex items-center justify-between px-4 border-b rule shrink-0">
            <span className="text-sm font-medium">Outline</span>
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-slide-accent-soft/50 transition-colors"
              aria-label="Close outline"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { goTo(i, 0); onClose(); }}
                className={cn(
                  "w-full text-left px-4 py-2.5 flex items-baseline gap-3 transition-colors",
                  i === index
                    ? "bg-slide-accent-soft text-slide-accent"
                    : "hover:bg-slide-accent-soft/40 text-slide-ink"
                )}
              >
                <span className="font-mono text-xs ink-soft w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm">{s.title}</span>
              </button>
            ))}
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
