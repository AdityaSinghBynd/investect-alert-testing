"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const ExpandableCell = ({ children }: { children: React.ReactNode }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useLayoutEffect(() => {
    const element = contentRef.current;
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [children]);

  const handleOpen = () => {
    if (isOverflowing) {
      setIsOpen(true);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger onClick={handleOpen} asChild>
        <div
          ref={contentRef}
          className={`max-h-[56px] overflow-hidden relative group ${
            isOverflowing ? "cursor-pointer line-clamp-3" : ""
          }`}
        >
          {children}
        </div>
      </PopoverTrigger>
      {isOverflowing && (
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] max-w-none rounded-md border border-[#eaf0fc] bg-layer-1 p-4 text-text-primary shadow-custom-blue"
          side="top"
          align="center"
          alignOffset={0}
          sideOffset={8}
        >
          <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}; 