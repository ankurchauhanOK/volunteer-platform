"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export function GoogleSignIn() {
  const { googleLogin } = useAuth()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [email, setEmail] = useState("")

  const handleGoogleResponse = async (email: string, name: string) => {
    setLoading(true)
    setError("")
    try {
      const result = await googleLogin(email, name)
      if (result.success) {
        if (result.isNewUser) {
          window.location.replace("/auth/select-role")
        } else {
          const redirect =
            searchParams.get("redirect") ||
            (result.role === "volunteer" ? "/volunteer/dashboard" :
             result.role === "host" ? "/host/dashboard" : "/")
          window.location.replace(redirect)
        }
      } else {
        setError(result.error || "Google sign-in failed")
        setLoading(false)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }
    handleGoogleResponse(email, email.split("@")[0])
  }

  return (
    <div className="space-y-3">
      {!showEmailInput ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => setShowEmailInput(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>
      ) : (
        <form onSubmit={handleDemoSubmit} className="space-y-3">
          <div>
            <label htmlFor="google-email" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your Gmail address
            </label>
            <input
              id="google-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={() => { setShowEmailInput(false); setError("") }}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
      )}
    </div>
  )
}
