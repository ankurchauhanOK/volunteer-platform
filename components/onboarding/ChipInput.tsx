"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { animateChip } from "@/lib/motion"

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
  dense?: boolean
  iconMap?: Record<string, string>
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
  dense = false,
  iconMap,
}: ChipInputProps) {
  const [search, setSearch] = useState("")
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const setChipRef = useCallback((value: string, el: HTMLButtonElement | null) => {
    if (el) chipRefs.current.set(value, el)
    else chipRefs.current.delete(value)
  }, [])

  const filtered = useMemo(
    () => (search ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())) : options),
    [options, search],
  )

  const handleToggle = (value: string) => {
    const el = chipRefs.current.get(value)
    if (el && !selected.includes(value)) animateChip(el)
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      if (max && selected.length >= max) return
      onChange([...selected, value])
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text uppercase tracking-wider">{label}</label>
        {selected.length > 0 && (
          <span className="text-[10px] text-text-muted">{selected.length} selected</span>
        )}
      </div>

      {searchable && (
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-100 transition-all"
          />
        </div>
      )}

      {popularTags && popularTags.length > 0 && !search && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] text-amber-600 font-medium mr-0.5 self-center">Popular:</span>
          {popularTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleToggle(tag)}
              ref={el => setChipRef(tag, el)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all",
                selected.includes(tag)
                  ? "bg-brand-100 border-brand-300 text-brand-700 shadow-sm"
                  : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
              )}
            >
              ★ {tag}
            </button>
          ))}
        </div>
      )}

      <div className={cn("flex flex-wrap gap-1.5", columns === 3 && "grid grid-cols-3 gap-1.5")}>
        {filtered.map(option => (
          <button
            key={option}
            ref={el => setChipRef(option, el)}
            type="button"
            onClick={() => handleToggle(option)}
            className={cn(
              "rounded-full border transition-all duration-150 inline-flex items-center gap-1",
              dense || columns === 3 ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
              selected.includes(option)
                ? "bg-brand-100 border-brand-300 text-brand-700 font-medium shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
            )}
          >
            {iconMap?.[option] && <span className="text-xs">{iconMap[option]}</span>}
            {option}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-xs text-gray-400 py-1">No matches found. Try a different search.</p>
      )}

      {max && selected.length >= max && (
        <p className="text-[10px] font-medium text-amber-700">Maximum {max} selections allowed</p>
      )}

      {helperText && <p className="text-[10px] text-text-muted">{helperText}</p>}
    </div>
  )
}
