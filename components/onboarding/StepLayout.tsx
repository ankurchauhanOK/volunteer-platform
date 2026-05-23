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
  homeHref?: string
  hideHeader?: boolean
  hideFooter?: boolean
  helperPanel?: ReactNode
  dashboard?: boolean
  bare?: boolean
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
  homeHref,
  hideHeader = false,
  hideFooter = false,
  helperPanel,
  dashboard = false,
  bare = false,
  children,
}: StepLayoutProps) {
  const stepLabels = ["Basic Details", "Interests", "Profile Intro", "Photos"]
  const contentRef = useStepTransition(currentStep)
  const progressPercent = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {!hideHeader && (
          <>
            {/* Navbar Card */}
            <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-6 shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_2px_4px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                {/* Left: Back */}
                <div className="w-24">
                  {!hideBack && onBack ? (
                    <button
                      type="button"
                      onClick={onBack}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full border border-sb-500 text-sb-600 text-sm font-medium transition-all duration-200 hover:bg-sb-50 active:scale-95 disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                  ) : homeHref ? (
                    <a
                      href={homeHref}
                      className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full border border-sb-500 text-sb-600 text-sm font-medium transition-all duration-200 hover:bg-sb-50 active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </a>
                  ) : null}
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

                {/* Right: spacer */}
                <div className="w-24" />
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6 px-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-sb-600 uppercase tracking-wider">
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <span className="text-xs text-text-muted">{stepLabels[currentStep] || `Step ${currentStep + 1}`}</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
          </>
        )}

        {bare ? (
          <div ref={contentRef}>{children}</div>
        ) : (
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
        )}

        {!hideFooter && (
          <>
            <div className="mt-4 flex justify-between items-center">
              <div />
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
          </>
        )}
      </div>
    </div>
  )
}
