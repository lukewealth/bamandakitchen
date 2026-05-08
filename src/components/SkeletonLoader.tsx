/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from "../lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export default function SkeletonLoader({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "bg-primary/5 animate-pulse overflow-hidden relative",
        variant === 'circle' ? "rounded-full" : "rounded-2xl",
        variant === 'text' ? "h-4 w-full rounded-md" : "",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
}
