"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

interface ChipInputProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  searchable?: boolean
  searchPlaceholder?: string
  helperText?: string
  popularTags?: string[]
  max?: number
  columns?: 2 | 3
}

export function ChipInput({
  label,
  options,
  selected,
  onChange,
  searchable = true,
  searchPlaceholder = "Search...",
  helperText,
  popularTags,
  max,
  columns = 2,
}: ChipInputProps) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () => (search ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())) : options),
    [options, search],
  )

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      if (max && selected.length >= max) return
      onChange([...selected, value])
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {searchable && (
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border-2 border-gray-200 pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      )}

      {popularTags && popularTags.length > 0 && !search && (
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleToggle(tag)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all",
                selected.includes(tag)
                  ? "bg-brand-100 border-brand-300 text-brand-700"
                  : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
              )}
            >
              ★ {tag}
            </button>
          ))}
        </div>
      )}

      <div className={cn("flex flex-wrap gap-2", columns === 3 && "grid grid-cols-3")}>
        {filtered.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            className={cn(
              "rounded-full text-sm border transition-all duration-150",
              columns === 3 ? "px-2 py-1.5 text-xs" : "px-3 py-1.5",
              selected.includes(option)
                ? "bg-brand-100 border-brand-400 text-brand-700 font-medium shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 py-2">No matches found. Try a different search.</p>
      )}

      {max && selected.length >= max && (
        <p className="text-xs text-amber-600">Maximum {max} selections allowed</p>
      )}

      {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
  )
}
