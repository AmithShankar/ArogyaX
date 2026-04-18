"use client";

import { cn } from "@/lib/utils";
import { ClinicalGridProps } from "@/types";

export function ClinicalGrid({ 
  size = 80, 
  id = "medical-grid", 
  className,
  opacity 
}: ClinicalGridProps) {
  return (
    <div 
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      style={{ opacity }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={id}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
