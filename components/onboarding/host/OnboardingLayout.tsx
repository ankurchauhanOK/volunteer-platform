"use client"

import { OnboardingHeader } from "./OnboardingHeader"
import { OnboardingFooter } from "./OnboardingFooter"
import { useHostOnboarding } from "./HostOnboardingContext"

interface OnboardingLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  showProgress?: boolean
  nextDisabled?: boolean
  nextLabel?: string
  backLabel?: string
  onNext?: () => void
  onBack?: () => void
  customNext?: React.ReactNode
}

export function OnboardingLayout({
  children,
  showHeader = true,
  showFooter = true,
  showProgress = true,
  nextDisabled = false,
  nextLabel = "Next",
  backLabel = "Back",
  onNext,
  onBack,
  customNext,
}: OnboardingLayoutProps) {
  const { currentStep, totalSteps, goNext, goBack, saveAndExit } = useHostOnboarding()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F6F4EF" }}>
      {/* Header */}
      {showHeader && (
        <OnboardingHeader onSaveAndExit={saveAndExit} />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-28">
        <div className="w-full max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <OnboardingFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={onBack || (currentStep > 0 ? goBack : undefined)}
          onNext={customNext ? undefined : (onNext || goNext)}
          nextDisabled={nextDisabled}
          nextLabel={nextLabel}
          backLabel={backLabel}
          showProgress={showProgress}
        />
      )}
    </div>
  )
}
