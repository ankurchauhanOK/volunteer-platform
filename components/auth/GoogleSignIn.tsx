"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
          }) => void
          prompt: (momentListener?: (moment: { getNotDisplayed: () => string; getMomentType: () => string }) => void) => void
          cancel: () => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function GoogleSignIn() {
  const { googleLogin } = useAuth()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const callbackRef = useRef<((response: { credential: string }) => void) | null>(null)
  const initialized = useRef(false)

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const handleCredentialResponse = useCallback(async (credential: string) => {
    setLoading(true)
    setError("")
    try {
      const payload = decodeJWT(credential)
      if (!payload?.email) {
        setError("Failed to read account information")
        setLoading(false)
        return
      }
      const result = await googleLogin(
        payload.email as string,
        (payload.name as string) || (payload.email as string),
        payload.picture as string | undefined,
      )
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
  }, [googleLogin, searchParams])

  useEffect(() => {
    callbackRef.current = (response: { credential: string }) => {
      handleCredentialResponse(response.credential)
    }
  }, [handleCredentialResponse])

  useEffect(() => {
    if (!clientId || initialized.current) return
    initialized.current = true

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            callbackRef.current?.(response)
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      if (window.google?.accounts.id.cancel) {
        window.google.accounts.id.cancel()
      }
    }
  }, [clientId])

  const handleGoogleSignIn = () => {
    if (window.google?.accounts.id) {
      window.google.accounts.id.prompt()
    }
  }

  if (!clientId) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-400 font-medium cursor-not-allowed"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800 leading-relaxed">
          Google OAuth not configured. Create a Client ID at{" "}
          <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer"
             className="text-amber-900 underline hover:no-underline">Google Cloud Console</a>
          {" "}and add it to <code className="font-mono text-amber-900 bg-amber-100 px-1 rounded">.env.local</code>:
          <div className="mt-1.5 p-2 bg-amber-100/50 rounded-lg font-mono text-amber-900 text-xs break-all">
            NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-brand-600" />
            Signing in...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
      )}
    </div>
  )
}
