"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface FAQ {
  question: string
  answer: string
}

interface SectionFAQProps {
  items: FAQ[]
}

export function SectionFAQ({ items }: SectionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {item.question}
            <svg
              className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", openIndex === i && "rotate-180")}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="px-3 pb-2.5 text-xs text-gray-500 leading-relaxed">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  )
}
