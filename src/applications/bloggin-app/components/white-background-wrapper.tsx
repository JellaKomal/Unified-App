"use client";

import * as React from "react";

interface WhiteBackgroundWrapperProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function WhiteBackgroundWrapper({
  children,
  fullWidth = false,
  className,
}: WhiteBackgroundWrapperProps) {
  return (
    <div className={`bg-background ${fullWidth ? "w-full" : "w-fit"} ${className}`}>
      {children}
    </div>
  );
}
