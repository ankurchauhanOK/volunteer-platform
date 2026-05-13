"use client"

import { useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { animateSelect, animateCheckmark } from "@/lib/motion"
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
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const setCardRef = useCallback((value: string, el: HTMLButtonElement | null) => {
    if (el) cardRefs.current.set(value, el)
    else cardRefs.current.delete(value)
  }, [])

  const isSelected = (value: string) =>
    multi ? (selected as string[]).includes(value) : selected === value

  const handleClick = (value: string) => {
    const el = cardRefs.current.get(value)
    if (el && !isSelected(value)) animateSelect(el)
    const checkEl = el?.querySelector(".check-icon") as HTMLElement | null
    if (checkEl) animateCheckmark(checkEl)

    if (multi) {
      const arr = selected as string[]
      onChange(
        arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      )
    } else {
      onChange(value)
    }
  }

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-semibold text-text">{label}</label>}
      <div className={cn("grid gap-2.5", columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
        {options.map(option => (
          <button
            key={option.value}
            ref={el => setCardRef(option.value, el)}
            type="button"
            onClick={() => handleClick(option.value)}
            className={cn(
              "relative flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all duration-200",
              isSelected(option.value)
                ? "border-brand-500 bg-brand-50 shadow-sm"
                : "border-border bg-white hover:border-brand-200 hover:shadow-sm hover:-translate-y-0.5",
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
              <div className="check-icon absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
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
