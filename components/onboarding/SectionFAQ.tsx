"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"

interface FAQ {
  question: string
  answer: string
}

interface SectionFAQProps {
  items: FAQ[]
}

export function SectionFAQ({ items }: SectionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const answerRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const setAnswerRef = (i: number, el: HTMLDivElement | null) => {
    if (el) answerRefs.current.set(i, el)
    else answerRefs.current.delete(i)
  }

  useEffect(() => {
    if (openIndex === null) return
    const el = answerRefs.current.get(openIndex)
    if (!el) return
    gsap.fromTo(
      el,
      { opacity: 0, y: -4 },
      { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", overwrite: "auto" }
    )
  }, [openIndex])

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-3.5 py-3 text-left text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
          >
            {item.question}
            <svg
              className={cn("w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ml-2", openIndex === i && "rotate-180")}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div
              ref={el => setAnswerRef(i, el)}
              className="px-3.5 pb-3 text-sm text-text-secondary leading-relaxed"
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
