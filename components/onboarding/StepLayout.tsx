"use client"

import type { ReactNode } from "react"
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
  sidebar?: ReactNode
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
  sidebar,
  children,
}: StepLayoutProps) {
  const stepLabels = ["Welcome", "Basic Details", "Skills & Talents", "Hobbies & Proof", "Travel Preferences", "Availability", "Safety", "Review"]

  return (
    <div className="min-h-screen bg-beige">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
            </svg>
          </div>
          <span className="font-tanker text-lg text-text tracking-normal">Voluntree</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="label-sm text-brand-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs text-text-muted">{stepLabels[currentStep] || `Step ${currentStep + 1}`}</span>
          </div>
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {sidebar ? (
            <>
              <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 sticky top-24">
                  <h1 className="font-tanker heading-3xl text-text">{title}</h1>
                  {subtitle && <p className="text-sm text-text-secondary mt-3 leading-relaxed">{subtitle}</p>}
                  {sidebar}
                </div>
              </div>
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-6">
                  {children}
                </div>
              </div>
            </>
          ) : (
            <div className="lg:col-span-10 lg:col-start-2">
              <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
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
