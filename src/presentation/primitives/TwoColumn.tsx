import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TwoColumnProps {
  left: ReactNode;
  right: ReactNode;
  /** Ratio for left column on desktop. Defaults 1:1. */
  ratio?: "1:1" | "5:7" | "7:5" | "2:3" | "3:2";
  className?: string;
  reverseOnMobile?: boolean;
}

const ratioClass: Record<NonNullable<TwoColumnProps["ratio"]>, string> = {
  "1:1": "lg:grid-cols-2",
  "5:7": "lg:grid-cols-[5fr_7fr]",
  "7:5": "lg:grid-cols-[7fr_5fr]",
  "2:3": "lg:grid-cols-[2fr_3fr]",
  "3:2": "lg:grid-cols-[3fr_2fr]",
};

export function TwoColumn({
  left,
  right,
  ratio = "1:1",
  className,
  reverseOnMobile = false,
}: TwoColumnProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 lg:gap-14",
        ratioClass[ratio],
        className
      )}
    >
      <div className={cn(reverseOnMobile && "order-2 lg:order-1")}>{left}</div>
      <div className={cn(reverseOnMobile && "order-1 lg:order-2")}>{right}</div>
    </div>
  );
}
