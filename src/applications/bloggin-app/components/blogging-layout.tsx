import React from "react";
import Header from "./header";
import { DottedBackground } from "@/components/backgrounds/dotted-background";
import { cn } from "@/lib/utils";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

export default function BloggingLayout({
  children,
  showBackground,
  className,
}: {
  children: React.ReactNode;
  showBackground: boolean;
  className?: string;
}) {
  return (
    <div className="min-h-[calc(100vh-48px)] w-full">
      {/* <FollowerPointerCard
        className="z-100"
        title={
          <TitleComponent
            title="JellA"
            avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png"
          />
        }
      > */}
        {showBackground && <DottedBackground />}
        <Header />
        <div
          className={cn(
            "px-10 pt-6 flex flex-col gap-4 w-full mx-auto mt-[48px]",
            className
          )}
        >
          {children}
        </div>
      {/* </FollowerPointerCard> */}
    </div>
  );
}

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex items-center space-x-2">
    <img
      src={avatar}
      height="20"
      width="20"
      alt="thumbnail"
      className="rounded-full border-2 border-white"
    />
    <p>{title}</p>
  </div>
);
