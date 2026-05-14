"use client"

import type { ReactNode } from "react"
import { useStepTransition } from "@/lib/motion"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/Progress"

interface StepLayoutProps {
  title: string
  subtitle?: string
  currentStep: number
  totalSteps: number
  onBack?: () => void
  onContinue?: () => void
  onSkip?: () => void
  continueLabel?: string
  continueDisabled?: boolean
  loading?: boolean
  hideBack?: boolean
  helperPanel?: ReactNode
  dashboard?: boolean
  children: ReactNode
}

export function StepLayout({
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  continueDisabled = false,
  loading = false,
  hideBack = false,
  helperPanel,
  dashboard = false,
  children,
}: StepLayoutProps) {
  const stepLabels = ["Welcome", "Basic Details", "Skills & Talents", "Hobbies & Proof", "Travel Preferences", "Availability", "Safety", "Review"]
  const contentRef = useStepTransition(currentStep)
  const progressPercent = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-sb-500 flex items-center justify-center shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
            </svg>
          </div>
          <span className="font-sans text-lg text-text tracking-normal">Voluntree</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="label-sm text-sb-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs text-text-muted">{stepLabels[currentStep] || `Step ${currentStep + 1}`}</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {helperPanel ? (
            <>
              <div className="lg:col-span-5 xl:col-span-4 space-y-3">
                <div className="bg-white rounded-xl border border-border p-5 lg:sticky lg:top-20 shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)]">
                  <h1 className="font-sans heading-2xl text-text">{title}</h1>
                  {subtitle && <p className="text-xs text-text-secondary mt-2 leading-relaxed">{subtitle}</p>}
                  {helperPanel}
                </div>
              </div>
              <div className="lg:col-span-7 xl:col-span-8" ref={contentRef}>
                {dashboard ? (
                  children
                ) : (
                  <div className="bg-white rounded-xl border border-border p-5 sm:p-6 shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)]">
                    {children}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="lg:col-span-10 lg:col-start-2" ref={contentRef}>
              {dashboard ? (
                <>
                  <div className="mb-4">
                    <h1 className="font-sans heading-2xl text-text">{title}</h1>
                    {subtitle && <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{subtitle}</p>}
                  </div>
                  {children}
                </>
              ) : (
                <div className="bg-white rounded-xl border border-border p-5 sm:p-6 shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)]">
                  <div className="mb-4">
                    <h1 className="font-sans heading-2xl text-text">{title}</h1>
                    {subtitle && <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{subtitle}</p>}
                  </div>
                  {children}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            {!hideBack && onBack && (
              <Button variant="ghost" onClick={onBack} disabled={loading}>
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {onSkip && (
              <button onClick={onSkip} className="text-xs text-text-muted hover:text-text transition-colors">
                Skip for now
              </button>
            )}
            {onContinue && (
              <Button onClick={onContinue} disabled={continueDisabled} loading={loading}>
                {continueLabel}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          Your progress is saved automatically
        </p>
      </div>
    </div>
  )
}
