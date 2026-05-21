"use client"

import { useState, useCallback, useMemo } from "react"

interface PromptWriteProps {
  promptId: string
  promptText: string
  initialAnswer: string
  onSave: (promptId: string, promptText: string, answer: string) => void
  onBack: () => void
}

const MAX_WORDS = 150

export function PromptWrite({ promptId, promptText, initialAnswer, onSave, onBack }: PromptWriteProps) {
  const [text, setText] = useState(initialAnswer)

  const wordCount = useMemo(() => {
    const trimmed = text.trim()
    return trimmed.length > 0 ? trimmed.split(/\s+/).length : 0
  }, [text])

  const handleSave = useCallback(() => {
    onSave(promptId, promptText, text.trim())
  }, [onSave, promptId, promptText, text])

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6 md:px-8 py-8 md:py-14">
      {/* Header */}
      <div className="text-center flex flex-col gap-4 items-center mb-10 md:mb-14">
        <h1 className="font-[Literata] text-[32px] md:text-[48px] font-semibold text-[#023625] max-w-[20ch] leading-[1.1] tracking-tight">
          {promptText}
        </h1>
        <p className="font-[Plus_Jakarta_Sans] text-[16px] md:text-[18px] text-[#414944] max-w-lg leading-relaxed">
          Share the small details that make a journey special to you.
        </p>
      </div>

      {/* Writing Area */}
      <div className="w-full flex flex-col gap-6">
        {/* Textarea Card */}
        <div className="bg-[#ebe8e1] rounded-[32px] p-6 md:p-10 shadow-[0_12px_48px_-12px_rgba(2,54,37,0.08)] border border-[#c0c9c2]/30 transition-all duration-300 focus-within:border-[#023625]/40 focus-within:shadow-[0_16px_56px_-12px_rgba(2,54,37,0.12)] relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I love slow travel, meeting new people, and experiencing cultures through local communities..."
            className="w-full bg-transparent border-none resize-none outline-none ring-0 focus:ring-0 font-[Plus_Jakarta_Sans] text-[16px] md:text-[18px] text-[#1c1c18] placeholder:text-[#c0c9c2] p-0 min-h-[240px] leading-relaxed"
          />
          <div className="flex justify-end items-center mt-6 pt-4 border-t border-[#c0c9c2]/20">
            <span
              className={`text-[13px] font-semibold tracking-wide ${
                wordCount > MAX_WORDS ? "text-[#ba1a1a]" : "text-[#717973]/70"
              }`}
            >
              {wordCount} / {MAX_WORDS} words
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-center mt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={text.trim().length === 0}
            className="bg-[#023625] text-white font-[Plus_Jakarta_Sans] text-[14px] font-semibold tracking-wider uppercase px-10 py-4 rounded-full hover:bg-[#1f4d3a] hover:shadow-[0_8px_28px_rgba(2,54,37,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2 group"
          >
            <span>Save Answer</span>
            <svg
              className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
