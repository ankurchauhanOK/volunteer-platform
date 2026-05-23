"use client"

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
  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Navbar Card */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_2px_4px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            {/* Left: Back */}
            <div className="w-24">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full border border-sb-500 text-sb-600 text-sm font-medium transition-all duration-200 hover:bg-sb-50 active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
            </div>

            {/* Center: Logo + Name */}
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sb-500 flex items-center justify-center shadow-[0_2px_6px_rgba(0,117,74,0.25)]">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
                </svg>
              </div>
              <span className="font-sans text-lg font-semibold text-text tracking-normal">Voluntree</span>
            </div>

            {/* Right: Skip or spacer */}
            <div className="w-24 flex justify-end">
              {showSkip && onSkip ? (
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-[13px] font-semibold tracking-wide text-[#717973] hover:text-[#023625] px-4 py-2 rounded-full border border-[#c0c9c2] hover:border-[#023625] transition-all duration-200"
                >
                  Skip
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Dot / Pill Progress */}
        {progressDots && (
          <div className="flex items-center justify-center gap-2.5 mt-6 mb-4">
            {progressDots.map((d, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  d === 1 ? "w-9 bg-[#1F4D45]" : "w-2 bg-[#B8C8C1]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
