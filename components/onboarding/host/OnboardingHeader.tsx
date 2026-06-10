"use client"

import { useRouter } from "next/navigation"

interface OnboardingHeaderProps {
  onSaveAndExit?: () => void
}

export function OnboardingHeader({ onSaveAndExit }: OnboardingHeaderProps) {
  const router = useRouter()

  return (
    <header className="w-full px-8 py-6 flex items-center justify-between">
      {/* Left: Voluntree Logo in Playfair */}
      <div
        className="text-2xl font-medium tracking-tight"
        style={{ fontFamily: "var(--font-playfair), serif", color: "#0D4F3A" }}
      >
        Voluntree
      </div>

      {/* Right: Questions? + Save & exit */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {/* TODO: open help modal */}}
          className="h-10 px-4 rounded-full border border-[#D9DDD8] text-sm font-medium transition-all duration-200 hover:border-[#0D4F3A] hover:text-[#0D4F3A]"
          style={{ color: "#6F756F" }}
        >
          Questions?
        </button>
        <button
          onClick={onSaveAndExit}
          className="h-10 px-4 rounded-full border border-[#D9DDD8] text-sm font-medium transition-all duration-200 hover:border-[#0D4F3A] hover:text-[#0D4F3A]"
          style={{ color: "#6F756F" }}
        >
          Save & exit
        </button>
      </div>
    </header>
  )
}
