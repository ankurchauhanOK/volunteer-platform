"use client"

import { useState, useCallback } from "react"
import { PersonalityTopBar } from "./PersonalityTopBar"
import { PromptOverview } from "./PromptOverview"
import { PromptHub } from "./PromptHub"
import { PromptWrite } from "./PromptWrite"
import type { PromptAnswer } from "@/lib/types"

type FlowView = "overview" | "hub" | "write"

interface PromptPersonalityFlowProps {
  answers: PromptAnswer[]
  onAnswersChange: (answers: PromptAnswer[]) => void
  onComplete: () => void
  onBackToPreviousStep?: () => void
}

export function PromptPersonalityFlow({
  answers,
  onAnswersChange,
  onComplete,
  onBackToPreviousStep,
}: PromptPersonalityFlowProps) {
  const [view, setView] = useState<FlowView>("overview")
  const [activePromptId, setActivePromptId] = useState<string | null>(null)
  const [activePromptText, setActivePromptText] = useState<string>("")

  const handlePickPrompt = useCallback(() => {
    setView("hub")
  }, [])

  const handleEditPrompt = useCallback((promptId: string) => {
    const ans = answers.find((a) => a.promptId === promptId)
    if (ans) {
      setActivePromptId(promptId)
      setActivePromptText(ans.promptText)
      setView("write")
    }
  }, [answers])

  const handleSelectPrompt = useCallback((promptId: string, promptText: string) => {
    setActivePromptId(promptId)
    setActivePromptText(promptText)
    setView("write")
  }, [])

  const handleSaveAnswer = useCallback(
    (promptId: string, promptText: string, answer: string) => {
      const existingIndex = answers.findIndex((a) => a.promptId === promptId)
      let next: PromptAnswer[]
      if (existingIndex >= 0) {
        next = [...answers]
        next[existingIndex] = { promptId, promptText, answer }
      } else {
        next = [...answers, { promptId, promptText, answer }]
      }
      onAnswersChange(next)
      setView("overview")
      setActivePromptId(null)
      setActivePromptText("")
    },
    [answers, onAnswersChange]
  )

  const handleBack = useCallback(() => {
    if (view === "write") {
      setView("overview")
      setActivePromptId(null)
      setActivePromptText("")
    } else if (view === "hub") {
      setView("overview")
    } else if (view === "overview") {
      onBackToPreviousStep?.()
    }
  }, [view, onBackToPreviousStep])

  const currentAnswer = answers.find((a) => a.promptId === activePromptId)?.answer || ""

  // Progress dots for top bar: step 5 of 6 => [0,0,0,0,1,0]
  const progressDots = [0, 0, 0, 0, 1, 0]

  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col bg-[#F5F2EA]">
      <PersonalityTopBar
        onBack={handleBack}
        progressDots={progressDots}
        showSkip={false}
      />

      <main className="flex-grow flex flex-col items-center justify-start pb-12">
        {view === "overview" && (
          <PromptOverview
            answers={answers}
            onPickPrompt={handlePickPrompt}
            onEditPrompt={handleEditPrompt}
          />
        )}

        {view === "hub" && (
          <PromptHub
            answers={answers}
            onSelectPrompt={handleSelectPrompt}
            onBack={handleBack}
          />
        )}

        {view === "write" && activePromptId && (
          <PromptWrite
            promptId={activePromptId}
            promptText={activePromptText}
            initialAnswer={currentAnswer}
            onSave={handleSaveAnswer}
            onBack={handleBack}
          />
        )}

        {/* Floating Continue CTA only on overview */}
        {view === "overview" && (
          <button
            type="button"
            onClick={onComplete}
            disabled={answers.length < 3}
            className={`fixed bottom-6 right-6 z-50 h-14 px-8 rounded-full text-base font-semibold shadow-[0_10px_30px_rgba(31,77,69,0.20)] transition-all duration-300 ${
              answers.length >= 3
                ? "bg-[#1F4D45] text-white hover:bg-[#2B645A] hover:shadow-[0_14px_40px_rgba(31,77,69,0.28)] hover:-translate-y-0.5 active:translate-y-0"
                : "bg-[#1F4D45]/40 text-white/70 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#c0c9c2]/30 bg-[#f6f3ec]">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-8 py-6 max-w-6xl mx-auto gap-4">
          <div className="font-[Literata] text-[18px] font-medium text-[#023625]">Voluntree</div>
          <div className="flex gap-6 text-[13px] font-semibold tracking-wide text-[#717973]">
            <button type="button" className="hover:text-[#023625] transition-colors">Privacy Policy</button>
            <button type="button" className="hover:text-[#023625] transition-colors">Terms of Service</button>
            <button type="button" className="hover:text-[#023625] transition-colors">Help Center</button>
          </div>
          <div className="text-[13px] text-[#717973]">2025 Voluntree. Rooted in Purpose.</div>
        </div>
      </footer>
    </div>
  )
}
