"use client"

import type { PromptAnswer } from "@/lib/types"

interface PromptHubProps {
  answers: PromptAnswer[]
  onSelectPrompt: (promptId: string, promptText: string) => void
  onBack: () => void
}

const ALL_PROMPTS = [
  { id: "chaotic-moment", text: "My most chaotic travel moment was..." },
  { id: "hostel-energy", text: "The kind of hostel energy I love is..." },
  { id: "ideal-day", text: "My ideal travel day looks like..." },
  { id: "traveler-type", text: "I'm the type of traveler who..." },
  { id: "never-travel-without", text: "One thing I'll never travel without..." },
  { id: "controversial-opinion", text: "My most controversial travel opinion..." },
  { id: "favourite-stranger", text: "My favourite kind of stranger to meet while travelling is..." },
  { id: "best-lesson", text: "The best travel lesson I've learned is..." },
  { id: "changed-perspective", text: "A local interaction that changed my perspective..." },
  { id: "always-pack", text: "I always make sure to pack..." },
  { id: "best-meal", text: "The best meal I ever had abroad was..." },
  { id: "keep-going-back", text: "The place I keep going back to is..." },
]

export function PromptHub({ answers, onSelectPrompt, onBack }: PromptHubProps) {
  const answerMap = new Map(answers.map((a) => [a.promptId, a]))
  const completedCount = answers.length

  return (
    <div className="flex flex-col items-center w-full max-w-[800px] mx-auto px-6 md:px-8 py-8 md:py-12">
      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {[0, 0, 1, 0].map((d, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              d === 1 ? "w-6 bg-[#023625]" : "w-2 bg-[#dcdad3]"
            }`}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center mb-12 md:mb-16 space-y-5 max-w-[600px]">
        <h1 className="font-[Literata] text-[32px] md:text-[48px] font-semibold text-[#023625] leading-tight">
          Give your profile some personality
        </h1>
        <p className="font-[Plus_Jakarta_Sans] text-[16px] md:text-[18px] text-[#414944] leading-relaxed">
          Pick a prompt to share your story. You&apos;ll need to answer at least 3 to continue.
        </p>
        <div className="text-[13px] font-semibold tracking-wider uppercase text-[#717973] pt-3">
          {completedCount} / 3 prompts completed
        </div>
      </div>

      {/* Prompt List */}
      <div className="w-full flex flex-col gap-3 md:gap-4">
        {ALL_PROMPTS.map((prompt) => {
          const isAnswered = answerMap.has(prompt.id)
          const ans = answerMap.get(prompt.id)

          return (
            <button
              key={prompt.id}
              type="button"
              onClick={() => onSelectPrompt(prompt.id, prompt.text)}
              className={`w-full text-left rounded-[32px] p-5 md:p-6 flex items-center justify-between group cursor-pointer transition-all duration-300 border border-transparent ${
                isAnswered
                  ? "bg-[#d4e9c4] border-[#384a2f] shadow-[0_10px_40px_-10px_rgba(2,54,37,0.08)]"
                  : "bg-[#f6f3ec] hover:bg-[#fcf9f2] hover:border-[#023625]/20 hover:shadow-[0_10px_40px_-10px_rgba(2,54,37,0.08)]"
              }`}
            >
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  {isAnswered && (
                    <svg className="w-4 h-4 text-[#023625] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                  <span
                    className={`font-[Plus_Jakarta_Sans] text-[16px] md:text-[18px] leading-snug ${
                      isAnswered
                        ? "text-[#101f09] font-semibold"
                        : "text-[#1c1c18] group-hover:text-[#023625]"
                    }`}
                  >
                    {prompt.text}
                  </span>
                </div>
                {isAnswered && ans && (
                  <p className="text-[14px] text-[#3a4c31] italic line-clamp-2 pl-6">
                    &mdash; {ans.answer}
                  </p>
                )}
              </div>

              {!isAnswered && (
                <svg
                  className="w-5 h-5 text-[#c0c9c2] group-hover:text-[#023625] opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 translate-x-1 group-hover:translate-x-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* Back button */}
      <div className="mt-12 w-full flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="bg-[#023625] text-white font-[Plus_Jakarta_Sans] text-[14px] font-semibold tracking-wider uppercase px-10 py-4 rounded-full hover:shadow-[0_8px_28px_rgba(2,54,37,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          Back to Overview
        </button>
      </div>
    </div>
  )
}
