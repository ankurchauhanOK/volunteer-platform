"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { GoogleSignIn } from "@/components/auth/GoogleSignIn"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

function LoginForm() {
  const searchParams = useSearchParams()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const raw = localStorage.getItem("vt_users")
      if (!raw || JSON.parse(raw).length === 0) {
        localStorage.setItem("vt_users", JSON.stringify([
          { id: "seed_admin", email: "admin@voluntree.in", password: "admin123!", name: "Admin", role: "admin", onboardingComplete: true, createdAt: new Date().toISOString() },
          { id: "seed_host", email: "host@example.com", password: "host123!", name: "Mountain View Hostel", role: "host", onboardingComplete: true, createdAt: new Date().toISOString() },
          { id: "seed_vol", email: "volunteer@example.com", password: "vol123!", name: "Priya Sharma", role: "volunteer", onboardingComplete: true, createdAt: new Date().toISOString() },
        ]))
      }
      const users = JSON.parse(localStorage.getItem("vt_users") || "[]")
      const user = users.find((u: any) => u.email === form.email)
      if (!user) {
        setError("No account found with this email")
        setLoading(false)
        return
      }
      if (user.password !== form.password) {
        setError("Incorrect password")
        setLoading(false)
        return
      }
      localStorage.setItem("vt_current_user", JSON.stringify(user))
      if (!user.onboardingComplete) {
        localStorage.removeItem("vt_onboarding_volunteer")
        localStorage.removeItem("vt_onboarding_host")
        const onboardingPath = user.role === "host" ? "/onboarding/host" : "/onboarding/volunteer"
        window.location.replace(onboardingPath)
        return
      }
      const redirect =
        searchParams.get("redirect") ||
        (user.role === "volunteer" ? "/volunteer/dashboard" :
         user.role === "host" ? "/host/dashboard" : "/")
      window.location.replace(redirect)
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Google Sign-In — primary */}
      <GoogleSignIn />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Email toggle */}
      {!showEmailForm ? (
        <button
          type="button"
          onClick={() => setShowEmailForm(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Sign in with email
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
          )}
          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="flex items-center justify-between">
            <Link href="/auth/forgot-password" className="text-xs text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
            <button
              type="button"
              onClick={() => { setShowEmailForm(false); setError("") }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {/* Demo accounts */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center mb-3">Demo accounts</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowEmailForm(true); setForm({ email: "volunteer@example.com", password: "vol123!" }) }}
          >
            Volunteer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowEmailForm(true); setForm({ email: "host@example.com", password: "host123!" }) }}
          >
            Host
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
                </svg>
              </div>
              <span className="font-tanker text-lg text-text tracking-normal">Voluntree</span>
            </Link>
            <h1 className="font-tanker text-2xl text-text">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="animate-pulse h-40 bg-gray-100 rounded-xl" />}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
