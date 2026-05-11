"use client"

import { cn } from "@/lib/utils"

interface CardOption {
  value: string
  label: string
  description?: string
  icon?: string
}

interface CardSelectProps {
  options: CardOption[]
  selected: string | string[]
  onChange: (value: string | string[]) => void
  multi?: boolean
  columns?: 2 | 3
  label?: string
  helperText?: string
}

export function CardSelect({
  options,
  selected,
  onChange,
  multi = false,
  columns = 2,
  label,
  helperText,
}: CardSelectProps) {
  const isSelected = (value: string) =>
    multi ? (selected as string[]).includes(value) : selected === value

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-text uppercase tracking-wider">{label}</label>}
      <div className={cn("grid gap-2.5", columns === 2 ? "grid-cols-2" : "grid-cols-3")}>
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
              "relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 sm:p-4 text-center transition-all duration-200",
              isSelected(option.value)
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm",
            )}
          >
            {option.icon && <span className="text-xl sm:text-2xl">{option.icon}</span>}
            <span className={cn(
              "text-xs sm:text-sm font-medium",
              isSelected(option.value) ? "text-brand-700" : "text-gray-700",
            )}>
              {option.label}
            </span>
            {option.description && (
              <span className="text-xs text-text-muted leading-tight">{option.description}</span>
            )}
            {isSelected(option.value) && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      {helperText && <p className="text-xs text-text-muted">{helperText}</p>}
    </div>
  )
}
