"use client"

import { useRouter } from "next/navigation"

interface OnboardingFooterProps {
  currentStep: number
  totalSteps: number
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  backLabel?: string
  showProgress?: boolean
}

export function OnboardingFooter({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Next",
  backLabel = "Back",
  showProgress = true,
}: OnboardingFooterProps) {
  const router = useRouter()

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full border-t border-[#D9DDD8] bg-[#F6F4EF]">
      <div className="max-w-[1280px] mx-auto px-8 py-5 flex items-center justify-between">
        {/* Left: Back */}
        <div className="w-[120px]">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[#D9DDD8] text-sm font-medium transition-all duration-200 hover:border-[#0D4F3A] hover:text-[#0D4F3A]"
              style={{ color: "#6F756F" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {backLabel}
            </button>
          )}
        </div>

        {/* Center: Progress */}
        {showProgress && (
          <div className="flex-1 flex items-center justify-center max-w-md mx-auto">
            <div className="w-full flex items-center gap-0">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex-1 flex items-center">
                  <div
                    className="h-1 flex-1 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: i <= currentStep ? "#0D4F3A" : "#D9DDD8",
                    }}
                  />
                  {i < totalSteps - 1 && (
                    <div className="w-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right: Next */}
        <div className="w-[120px] flex justify-end">
          {onNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className="inline-flex items-center gap-2 h-10 px-6 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: nextDisabled ? "#D9DDD8" : "#0D4F3A",
                color: "#FFFFFF",
              }}
            >
              {nextLabel}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </footer>
  )
}
