"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollWrapper({
  children,
  className,
  childrenClassName,
}: {
  children: React.ReactNode;
  className?: string;
  childrenClassName?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-y-auto",
        className
      )}
    >
      <div className={cn("min-h-max", childrenClassName)}>{children}</div>
    </div>
  );
}
