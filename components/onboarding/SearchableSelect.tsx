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
          "w-full rounded-xl border-2 px-4 py-2.5 text-sm text-left transition-all outline-none bg-white",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
          error ? "border-red-300" : "border-gray-200 hover:border-gray-300",
        )}
      >
        {value ? (
          <span className="text-gray-900">{selectedLabel}</span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type to search..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
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
                  "w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 transition-colors",
                  value === option.value ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-700",
                )}
              >
                {option.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">No options found</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
  )
}
