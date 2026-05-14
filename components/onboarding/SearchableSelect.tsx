"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SearchableSelectProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helperText?: string
  error?: string
}

export function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Search...",
  helperText,
  error,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const filtered = useMemo(
    () =>
      search
        ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
        : options,
    [options, search],
  )

  const selectedLabel = options.find(o => o.value === value)?.label || ""

  return (
    <div className="space-y-1.5 relative" ref={ref}>
      <label className="block text-xs font-semibold text-text uppercase tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full rounded-xl border-2 px-4 py-2.5 text-sm text-left transition-all bg-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500 focus-visible:border-sb-500",
          error ? "border-red-300" : "border-border hover:border-gray-300",
        )}
      >
        {value ? (
          <span className="text-text">{selectedLabel}</span>
        ) : (
          <span className="text-text-muted">{placeholder}</span>
        )}
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-border shadow-sm max-h-60 overflow-hidden">
          <div className="p-2 border-b border-border-light">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type to search..."
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-sb-500 focus:ring-1 focus:ring-sb-100"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-44">
            {filtered.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                  setSearch("")
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:bg-sb-50",
                  value === option.value ? "bg-sb-50 text-sb-700 font-medium" : "text-text-secondary hover:bg-sb-50",
                )}
              >
                {option.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-text-muted">No options found</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-error-text">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
    </div>
  )
}
