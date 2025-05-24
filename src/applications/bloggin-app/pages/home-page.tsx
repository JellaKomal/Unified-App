import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { CardWithForm } from "../../../components/design-system/blogging/Card"; 
import BloggingLayout from "../components/blogging-layout";

function HomePage() {
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
    <BloggingLayout showBackground={true}>
      <div
        ref={containerRef}
        className="relative flex h-[calc(100vh-200px)] w-full items-center justify-center bg-[(--var(--background))] dark:bg-black overflow-hidden"
      >
        <div
          className="absolute top-0 bottom-0 w-0 border-l border-[var(--primary)] border-dotted z-0 pointer-events-none"
          style={{ left: `${mousePos.x}px` }}
        />
        <div
          className="absolute left-0 right-0 h-0 border-t border-[var(--primary)] border-dotted z-0 pointer-events-none"
          style={{ top: `${mousePos.y}px` }}
        />
        <div className="flex flex-col gap-2 items-center justify-center z-10">
          <span className="text-5xl font-bold">
            Discover, Learn and Share Knowledge
          </span>
          <span className="text-xl italic">
            Join a community of tech enthusiasts, students, and professionals
          </span>
          <div className="flex gap-2 mt-5">
            <Button className=" w-30">Explore Now</Button>
            <Button variant="secondary" className="w-30">
              Join Now
            </Button>
          </div>
          <div className="flex flex-row gap-2 mt-20">
            <CardWithForm />
            <CardWithForm />
            <CardWithForm />
          </div>
        </div>
      </div>
    </BloggingLayout>
  );
}

export default HomePage;
