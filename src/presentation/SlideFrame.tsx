import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SlideFrameProps {
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Hide the title row (e.g. for the title slide which is fully custom) */
  bare?: boolean;
}

export function SlideFrame({ eyebrow, title, children, className, bare }: SlideFrameProps) {
  return (
    <section
      className={cn(
        "slide-surface relative h-full w-full overflow-hidden",
        "px-6 py-6 sm:px-10 sm:py-10 lg:px-20 lg:py-16",
        "flex flex-col gap-8",
        className
      )}
    >
      {!bare && (title || eyebrow) && (
        <header className="flex flex-col gap-2 animate-fade-in">
          {eyebrow && (
            <span className="font-mono text-xs uppercase tracking-[0.18em] ink-soft">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-slide-ink">
              {title}
            </h2>
          )}
          <div className="mt-1 h-px w-16 bg-slide-accent" />
        </header>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
}
