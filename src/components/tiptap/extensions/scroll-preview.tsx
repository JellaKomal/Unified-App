import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollPreviewProps {
  editorContent: string;
  onScroll: (scrollTop: number) => void;
  className?: string;
}

export function ScrollPreview({ editorContent, onScroll, className }: ScrollPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate viewport height based on container height
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setViewportHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Calculate content height
  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContentHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [editorContent]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaY = e.clientY - dragStartY;
    const scrollRatio = deltaY / viewportHeight;
    const newScrollTop = Math.max(0, Math.min(scrollTop + scrollRatio * contentHeight, contentHeight - viewportHeight));
    
    setScrollTop(newScrollTop);
    onScroll(newScrollTop);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStartY, viewportHeight, contentHeight, scrollTop]);

  const viewportIndicatorStyle = {
    height: `${(viewportHeight / contentHeight) * 100}%`,
    top: `${(scrollTop / contentHeight) * 100}%`,
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full overflow-hidden', className)}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={contentRef}
        className="w-full"
        data-preview-scroll
        dangerouslySetInnerHTML={{ __html: editorContent }}
      />
      <div
        className="absolute left-0 right-0 bg-blue-500/20 border border-blue-500/40 rounded-sm cursor-grab active:cursor-grabbing"
        style={viewportIndicatorStyle}
      />
    </div>
  );
} 