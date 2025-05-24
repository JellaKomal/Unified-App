import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function Blog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black overflow-hidden"
    >
      {/* Dotted background */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )}
      />
 
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle 70px at ${mousePos.x}px ${mousePos.y}px, white, transparent 150px)`,
          transition: "background 0.05s ease-out",
        }}
      />
    </div>
  );
}

export default Blog;
