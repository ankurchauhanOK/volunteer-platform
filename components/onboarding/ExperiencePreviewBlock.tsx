"use client"

import { experienceOptions } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface ExperiencePreviewBlockProps {
  selected: string[]
  onChange: (selected: string[]) => void
  description: string
  onDescriptionChange: (desc: string) => void
}

const experienceIcons: Record<string, string> = {
  "Mountain life": "🏔️",
  "Farm work": "🌾",
  "Cafe culture": "☕",
  "Hostel community": "🏠",
  "Yoga sessions": "🧘",
  Hiking: "🥾",
  "Cooking together": "🍳",
  "Language exchange": "🗣️",
  "Local exploration": "🗺️",
  "Creative collaboration": "🎭",
  "Slow living": "🌅",
  "Sustainable lifestyle": "🌱",
}

export function ExperiencePreviewBlock({
  selected,
  onChange,
  description,
  onDescriptionChange,
}: ExperiencePreviewBlockProps) {
  const toggle = (exp: string) => {
    onChange(
      selected.includes(exp)
        ? selected.filter(e => e !== exp)
        : [...selected, exp],
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">What will volunteers experience here?</label>
        <div className="flex flex-wrap gap-2">
          {experienceOptions.map(exp => (
            <button
              key={exp}
              type="button"
              onClick={() => toggle(exp)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm transition-all duration-200",
                selected.includes(exp)
                  ? "border-brand-500 bg-brand-50 text-brand-700 font-medium ring-2 ring-brand-100"
                  : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:shadow-sm",
              )}
            >
              <span>{experienceIcons[exp] || "✦"}</span>
              <span>{exp}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Anything special volunteers should know?</label>
        <textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Optional: Describe a typical day, unique experiences, or special perks..."
          rows={3}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none"
        />
      </div>
    </div>
  )
}
