"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExpandableCellProps {
  children: React.ReactNode;
  onOverflowChange?: (isOverflowing: boolean) => void;
  cellId?: string;
}

export const ExpandableCell = ({ 
  children, 
  onOverflowChange,
  cellId 
}: ExpandableCellProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const previousOverflowState = React.useRef<boolean>(false);

  // Check for overflow with debouncing to prevent infinite re-renders
  React.useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const checkOverflow = () => {
      const isContentOverflowing = element.scrollHeight > element.clientHeight;
      
      // Only update if the overflow state actually changed
      if (isContentOverflowing !== previousOverflowState.current) {
        previousOverflowState.current = isContentOverflowing;
        setIsOverflowing(isContentOverflowing);
        onOverflowChange?.(isContentOverflowing);
      }
    };

    // Use setTimeout to debounce the initial check
    const timeoutId = setTimeout(checkOverflow, 0);

    // Use ResizeObserver for dynamic content changes
    const resizeObserver = new ResizeObserver(() => {
      // Debounce the resize observer callback
      clearTimeout(timeoutId);
      setTimeout(checkOverflow, 10);
    });
    
    resizeObserver.observe(element);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [children]); // Removed onOverflowChange from dependencies to prevent infinite loops

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOverflowing) {
      setIsOpen(true);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger onClick={handleTriggerClick} asChild>
        <div
          ref={contentRef}
          className={`
            max-h-[56px] overflow-hidden relative
            ${isOverflowing ? 'cursor-pointer' : 'cursor-default'}
          `}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
          }}
        >
          {children}
          {/* Gradient overlay for visual overflow indication */}
          {isOverflowing && (
            <div 
              className="absolute bottom-0 right-0 w-8 h-4 bg-gradient-to-l from-layer-1 to-transparent pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      </PopoverTrigger>
      {isOverflowing && (
        <PopoverContent
          className="w-[500px] max-w-[90vw] rounded-md border border-secondary bg-layer-2 p-3 text-text-primary shadow-custom-blue z-50"
          side="top"
          align="start"
          alignOffset={0}
          sideOffset={8}
        >
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            <div className="whitespace-pre-line text-sm text-text-secondary">
              {children}
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};