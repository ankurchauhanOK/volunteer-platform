"use client"

import type { PromptAnswer } from "@/lib/types"

interface PromptOverviewProps {
  answers: PromptAnswer[]
  onPickPrompt: (index: number) => void
  onEditPrompt: (promptId: string) => void
}

const MAX_CARDS = 3

export function PromptOverview({ answers, onPickPrompt, onEditPrompt }: PromptOverviewProps) {
  const completedCount = answers.length
  const filledCards = answers.slice(0, MAX_CARDS)
  const emptySlots = Math.max(0, MAX_CARDS - filledCards.length)

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-6 md:px-8 py-8 md:py-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <h1
          className="font-[Literata] text-[36px] md:text-[48px] font-semibold text-[#023625] leading-[1.1] tracking-tight mb-5"
        >
          Pick prompts to share your story
        </h1>
        <p className="font-[Plus_Jakarta_Sans] text-[16px] md:text-[18px] text-[#414944] leading-relaxed">
          Choose at least 3 prompts that help people understand your travel personality, experiences, and mindset.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full mb-12 md:mb-16">
        {filledCards.map((ans) => (
          <div
            key={ans.promptId}
            className="relative bg-[#CFE4C9] border border-[#384a2f] rounded-[28px] p-6 md:p-8 min-h-[260px] flex flex-col organic-shadow transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start mb-5">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#023625] bg-[#bceed3] px-3 py-1 rounded-full">
                Selected
              </span>
              <button
                type="button"
                onClick={() => onEditPrompt(ans.promptId)}
                className="text-[#414944] hover:text-[#023625] transition-colors p-1.5 rounded-full hover:bg-[#023625]/5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              </button>
            </div>

            <h3 className="font-[Literata] text-[20px] md:text-[24px] font-medium text-[#023625] leading-snug mb-4">
              &ldquo;{ans.promptText}&rdquo;
            </h3>

            <p className="font-[Plus_Jakarta_Sans] text-[15px] text-[#414944] leading-relaxed mt-auto line-clamp-3">
              {ans.answer}
            </p>
          </div>
        ))}

        {Array.from({ length: emptySlots }, (_, i) => (
          <button
            key={`empty-${i}`}
            type="button"
            onClick={() => onPickPrompt(filledCards.length + i)}
            className="bg-[#f6f3ec] border-2 border-dashed border-[#c0c9c2]/60 rounded-[28px] p-6 md:p-8 min-h-[260px] flex flex-col items-center justify-center gap-4 hover:bg-[#f1eee7] hover:border-[#023625]/30 transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-full bg-[#f1eee7] flex items-center justify-center shadow-[0_8px_30px_rgba(2,54,37,0.06)] group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-[#023625]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-wider uppercase text-[#023625] bg-[#fcf9f2] px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(2,54,37,0.06)] group-hover:bg-[#023625] group-hover:text-white transition-all duration-300">
              Pick Prompt
            </span>
          </button>
        ))}
      </div>

      {/* Action */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[13px] font-semibold tracking-wider uppercase text-[#717973]">
          {completedCount} / {MAX_CARDS} prompts selected
        </span>
      </div>
    </div>
  )
}
