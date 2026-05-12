"use client"

import { useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { animateSelect, animateCheckmark } from "@/lib/motion"

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
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-text uppercase tracking-wider">{label}</label>}
      <div className={cn("grid gap-2.5", columns === 2 ? "grid-cols-2" : "grid-cols-3")}>
        {options.map(option => (
          <button
            key={option.value}
            ref={el => setCardRef(option.value, el)}
            type="button"
            onClick={() => handleClick(option.value)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 sm:p-4 text-center transition-all duration-200",
              isSelected(option.value)
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100 shadow-sm"
                : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5",
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
              <div className="check-icon absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
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
