"use client"

import { vibeOptions as vibeOpts } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface PropertyVibeSelectorProps {
  selected: string[]
  onChange: (vibes: string[]) => void
}

const vibeIcons: Record<string, string> = {
  Peaceful: "🧘",
  Social: "🎉",
  "Backpacker-friendly": "🎒",
  Creative: "🎨",
  "Nature-focused": "🌿",
  "Community-driven": "🤝",
  Spiritual: "🕉️",
  "Remote-work friendly": "💻",
  "Eco-conscious": "♻️",
  "Adventure-oriented": "🏔️",
  Minimalist: "✧",
  Cultural: "🏛️",
}

export function PropertyVibeSelector({ selected, onChange }: PropertyVibeSelectorProps) {
  const toggle = (vibe: string) => {
    onChange(
      selected.includes(vibe)
        ? selected.filter(v => v !== vibe)
        : [...selected, vibe],
    )
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">What best describes your place?</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {vibeOpts.map(vibe => (
          <button
            key={vibe}
            type="button"
            onClick={() => toggle(vibe)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm transition-all duration-200",
              selected.includes(vibe)
                ? "border-brand-500 bg-brand-50 text-brand-700 font-medium ring-2 ring-brand-100"
                : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:shadow-sm",
            )}
          >
            <span className="text-lg">{vibeIcons[vibe] || "✦"}</span>
            <span>{vibe}</span>
            {selected.includes(vibe) && (
              <svg className="ml-auto w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
