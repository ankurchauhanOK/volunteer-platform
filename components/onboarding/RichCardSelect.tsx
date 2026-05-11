"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface RichCardOption {
  value: string
  label: string
  description?: string
  icon?: string
  badge?: string
}

interface RichCardSelectProps {
  options: RichCardOption[]
  selected: string | string[]
  onChange: (value: string | string[]) => void
  multi?: boolean
  columns?: 2 | 3
  label?: string
  helperText?: string
}

export function RichCardSelect({
  options,
  selected,
  onChange,
  multi = false,
  columns = 2,
  label,
  helperText,
}: RichCardSelectProps) {
  const isSelected = (value: string) =>
    multi ? (selected as string[]).includes(value) : selected === value

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-semibold text-text">{label}</label>}
      <div className={cn("grid gap-3", columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (multi) {
                const arr = selected as string[]
                onChange(
                  arr.includes(option.value)
                    ? arr.filter(v => v !== option.value)
                    : [...arr, option.value],
                )
              } else {
                onChange(option.value)
              }
            }}
            className={cn(
              "relative flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all duration-200",
              isSelected(option.value)
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                : "border-border bg-white hover:border-brand-200 hover:shadow-sm",
            )}
          >
            {option.icon && (
              <span className="text-2xl">{option.icon}</span>
            )}
            <div className="space-y-0.5 w-full">
              <span className={cn(
                "text-sm font-semibold block",
                isSelected(option.value) ? "text-brand-700" : "text-text",
              )}>
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-text-secondary leading-snug block">{option.description}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {option.badge && (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                  {option.badge}
                </span>
              )}
            </div>
            {isSelected(option.value) && (
              <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center animate-check-pop">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>
      {helperText && <p className="text-xs text-text-muted">{helperText}</p>}
    </div>
  )
}
