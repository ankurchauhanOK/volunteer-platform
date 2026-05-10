"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Providers } from "@/components/Providers"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import type { UserRole } from "@/lib/types"

function SignupForm() {
  const { signup } = useAuth()
  const searchParams = useSearchParams()
  const preselectedRole = searchParams.get("role") as UserRole | null

  const [step, setStep] = useState<"role" | "details">(preselectedRole ? "details" : "role")
  const [role, setRole] = useState<UserRole>(preselectedRole || "volunteer")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await signup({ ...form, role })
    if (result.success) {
      window.location.href = role === "volunteer" ? "/onboarding/volunteer" : "/onboarding/host"
    } else {
      setLoading(false)
      setError(result.error || "Signup failed")
    }
  }

  if (step === "role") {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 text-center">I am a...</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setRole("volunteer"); setStep("details") }}
            className="p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-200 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">Volunteer</p>
            <p className="text-xs text-gray-500 mt-1">I want to travel and help</p>
          </button>
          <button
            onClick={() => { setRole("host"); setStep("details") }}
            className="p-6 rounded-2xl border-2 border-gray-200 hover:border-ocean-500 hover:bg-ocean-50 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-ocean-200 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">Host</p>
            <p className="text-xs text-gray-500 mt-1">I have opportunities to offer</p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        id="name"
        placeholder="Your full name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
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
        placeholder="Create a strong password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
        helperText="At least 8 characters with letters and numbers"
      />
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
      )}
      <Button type="submit" loading={loading} className="w-full">
        {loading ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
      </p>
    </form>
  )
}

export default function SignupPage() {
  return (
    <Providers>
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
                <span className="text-lg font-bold text-gray-900">Voluntree</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-sm text-gray-500 mt-1">Join the community</p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="animate-pulse h-40 bg-gray-100 rounded-xl" />}>
                <SignupForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </Providers>
  )
}
