"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/Button"

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
  children,
}: StepLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/30 via-white to-white py-6 sm:py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
            </svg>
          </div>
          <span className="text-base font-bold text-gray-900">Voluntree</span>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-brand-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
          {onSkip && (
            <button onClick={onSkip} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Skip for now
            </button>
          )}
        </div>

        <div className="flex gap-1 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-brand-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
          <div className="mb-5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>

          {children}

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <div>
              {!hideBack && onBack && (
                <Button variant="ghost" onClick={onBack} disabled={loading}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {onContinue && (
                <Button onClick={onContinue} disabled={continueDisabled} loading={loading}>
                  {continueLabel}
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Your progress is saved automatically
        </p>
      </div>
    </div>
  )
}
