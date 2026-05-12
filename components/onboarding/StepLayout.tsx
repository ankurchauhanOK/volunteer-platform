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
  children,
}: StepLayoutProps) {
  const stepLabels = ["Welcome", "Basic Details", "Skills & Talents", "Hobbies & Proof", "Travel Preferences", "Availability", "Safety", "Review"]
  const contentRef = useStepTransition(currentStep)
  const progressPercent = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-beige">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
            </svg>
          </div>
          <span className="font-tanker text-xl text-text tracking-normal">Voluntree</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="label-sm text-brand-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs text-text-muted">{stepLabels[currentStep] || `Step ${currentStep + 1}`}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {helperPanel ? (
            <>
              <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-border p-7 sm:p-8 lg:sticky lg:top-24 shadow-sm">
                  <h1 className="font-tanker heading-3xl text-text">{title}</h1>
                  {subtitle && <p className="text-sm text-text-secondary mt-3 leading-relaxed">{subtitle}</p>}
                  {helperPanel}
                </div>
              </div>
              <div className="lg:col-span-7 xl:col-span-8" ref={contentRef}>
                <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                  {children}
                </div>
              </div>
            </>
          ) : (
            <div className="lg:col-span-10 lg:col-start-2" ref={contentRef}>
              <div className="bg-white rounded-2xl border border-border p-7 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h1 className="font-tanker heading-3xl text-text">{title}</h1>
                  {subtitle && <p className="text-sm text-text-secondary mt-2 leading-relaxed">{subtitle}</p>}
                </div>
                {children}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
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

        <p className="text-center text-xs text-text-muted mt-6">
          Your progress is saved automatically
        </p>
      </div>
    </div>
  )
}
