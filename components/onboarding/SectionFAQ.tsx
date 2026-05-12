"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"
import { HelpCircle, Shield, Info, Lightbulb, AlertCircle } from "lucide-react"

interface FAQ {
  question: string
  answer: string
}

interface SectionFAQProps {
  items: FAQ[]
}

const iconMap: Record<string, typeof HelpCircle> = {
  safety: Shield,
  help: HelpCircle,
  why: Info,
  tip: Lightbulb,
  warning: AlertCircle,
}

function getIcon(question: string) {
  const key = Object.keys(iconMap).find(k => question.toLowerCase().includes(k))
  const Icon = key ? iconMap[key] : HelpCircle
  return <Icon className="w-3.5 h-3.5 text-brand-500 shrink-0" />
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
      { opacity: 1, y: 0, duration: 0.2, ease: "power2.out", overwrite: "auto" }
    )
  }, [openIndex])

  if (items.length === 0) return null

  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-brand-100/50 bg-brand-50/30 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium transition-colors",
              openIndex === i ? "text-brand-700" : "text-text-secondary hover:text-text"
            )}
          >
            {getIcon(item.question)}
            <span className="flex-1">{item.question}</span>
            <svg
              className={cn("w-3 h-3 text-brand-400 transition-transform duration-200 shrink-0", openIndex === i && "rotate-180")}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div
              ref={el => setAnswerRef(i, el)}
              className="px-3 pb-2.5 text-xs text-text-secondary leading-relaxed"
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
