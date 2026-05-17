"use client"

import { cn } from "@/lib/utils"

interface InterestChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function InterestChip({ label, selected, onClick }: InterestChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        "px-5 py-2.5",
        "rounded-full",
        "text-sm font-medium tracking-tight",
        "border",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500",
        "active:scale-95",
        selected
          ? "bg-sb-50 border-sb-500 text-sb-700 ring-1 ring-sb-500/20 hover:bg-sb-100"
          : "bg-white border-border text-text-secondary hover:border-gray-300 hover:bg-ceramic/30",
      )}
    >
      {label}
    </button>
  )
}
