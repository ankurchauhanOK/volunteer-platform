"use client"

import { useRouter } from "next/navigation"

interface PersonalityTopBarProps {
  onBack?: () => void
  progressDots?: number[]
  showSkip?: boolean
  onSkip?: () => void
}

export function PersonalityTopBar({
  onBack,
  progressDots,
  showSkip,
  onSkip,
}: PersonalityTopBarProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-[#F5F2EA]">
      <div className="flex justify-between items-center w-full px-6 md:px-8 py-5 max-w-6xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] font-medium text-[#023625] hover:text-[#0E4B36] transition-all duration-200 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="font-[Literata] text-[22px] font-semibold text-[#023625] tracking-tight">
          Voluntree
        </div>

        {showSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="text-[13px] font-semibold tracking-wide text-[#717973] hover:text-[#023625] px-4 py-2 rounded-full border border-[#c0c9c2] hover:border-[#023625] transition-all duration-200"
          >
            Skip for now
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {progressDots && (
        <div className="flex justify-center pb-4">
          <div className="flex gap-2 items-center">
            {progressDots.map((d, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  d === 1
                    ? "w-8 bg-[#023625]"
                    : "w-2 bg-[#023625]/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
