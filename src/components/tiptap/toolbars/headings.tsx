"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbar-provider";
import { useMediaQuery } from "@/hooks/use-media-querry";
import { MobileToolbarGroup, MobileToolbarItem } from "./mobile-toolbar-group";

const levels = [1, 2, 3, 4] as const;

export const HeadingsToolbar = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const activeLevel = levels.find((level) =>
    editor?.isActive("heading", { level })
  );

  if (isMobile) {
    return (
      <MobileToolbarGroup label={activeLevel ? `H${activeLevel}` : "Normal"}>
        <MobileToolbarItem
          onClick={() => editor?.chain().focus().setParagraph().run()}
          active={!editor?.isActive("heading")}
        >
          Normal
        </MobileToolbarItem>
        {levels.map((level) => (
          <MobileToolbarItem
            key={level}
            onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}
            active={editor?.isActive("heading", { level })}
          >
            H{level}
          </MobileToolbarItem>
        ))}
      </MobileToolbarGroup>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-max gap-1 px-3 font-normal hover:bg-primary/50 hover:text-background",
                editor?.isActive("heading") && "bg-primary/50 text-background",
                className
              )}
              ref={ref}
              {...props}
            >
              {activeLevel ? `H${activeLevel}` : "Normal"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={cn(
                "flex items-center gap-2 h-fit hover:bg-primary/50 hover:text-background text-xs",
                !editor?.isActive("heading") && "bg-primary/20"
              )}
            >
              Normal
            </DropdownMenuItem>
            {levels.map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level }).run()
                }
                className={cn(
                  "flex items-center gap-2 hover:bg-primary/50 hover:text-background text-xs",
                  editor?.isActive("heading", { level }) && "bg-primary/20"
                )}
              >
                H{level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>
        <span>Headings</span>
      </TooltipContent>
    </Tooltip>
  );
});

HeadingsToolbar.displayName = "HeadingsToolbar";
