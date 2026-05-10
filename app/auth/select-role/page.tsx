"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function SelectRolePage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSelect = (role: "volunteer" | "host") => {
    setLoading(role)
    updateUser({ role, onboardingComplete: false })
    const redirect = role === "volunteer" ? "/onboarding/volunteer" : "/onboarding/host"
    window.location.replace(redirect)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-gray-500">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">Voluntree</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Voluntree!</h1>
            <p className="text-sm text-gray-500 mt-1.5">You&apos;re almost there. Tell us how you want to get started.</p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => handleSelect("volunteer")}
              disabled={loading !== null}
              className="group relative w-full p-6 md:p-8 rounded-2xl border-2 border-gray-200 bg-white text-left hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                  <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">Volunteer</h2>
                    {loading === "volunteer" && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-500 border-t-transparent" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Travel on a budget, gain new skills, and make a real impact in communities across India.
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {["Free accommodation and meals", "Choose from 50+ hosts", "Learn new skills"].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-3.5 h-3.5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </div>
            </button>

            <button
              onClick={() => handleSelect("host")}
              disabled={loading !== null}
              className="group relative w-full p-6 md:p-8 rounded-2xl border-2 border-gray-200 bg-white text-left hover:border-ocean-500 hover:shadow-lg hover:shadow-ocean-500/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-ocean-50 flex items-center justify-center shrink-0 group-hover:bg-ocean-100 transition-colors">
                  <svg className="w-6 h-6 text-ocean-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">Host</h2>
                    {loading === "host" && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-ocean-500 border-t-transparent" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Get enthusiastic help for your space while providing meaningful cultural exchange.
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {["List your opportunity for free", "Get vetted, motivated volunteers", "Build a global community"].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-3.5 h-3.5 text-ocean-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-ocean-500 transition-colors shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
