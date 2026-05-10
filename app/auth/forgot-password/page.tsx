"use client"

import { useState } from "react"
import Link from "next/link"
import { Providers } from "@/components/Providers"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
              <p className="text-sm text-gray-500 mt-1">{sent ? "Check your email" : "Enter your email and we'll send you a reset link"}</p>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">If an account exists with {email}, you will receive a password reset link shortly.</p>
                  <Link href="/auth/login">
                    <Button variant="outline">Back to login</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">Send reset link</Button>
                  <p className="text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Providers>
  )
}
