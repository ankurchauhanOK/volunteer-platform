"use client"

import { cn } from "@/lib/utils"

interface SegmentedProgressProps {
  currentStep: number
  totalSteps: number
}

export function SegmentedProgress({ currentStep, totalSteps }: SegmentedProgressProps) {
  return (
    <div className="flex items-center gap-1 w-full max-w-[200px] mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 h-1.5 rounded-full transition-all duration-300",
            i <= currentStep ? "bg-sb-500" : "bg-border",
          )}
        />
      ))}
    </div>
  )
}
