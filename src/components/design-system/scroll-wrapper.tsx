"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollWrapper({
  children,
  className,
  childrenClassName,
  onScroll,
}: {
  children: React.ReactNode;
  className?: string;
  childrenClassName?: string;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-y-auto",
        className
      )}
      onScroll={onScroll}
    >
      <div className={cn("min-h-max", childrenClassName)}>{children}</div>
    </div>
  );
}
