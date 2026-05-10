"use client"

import Link from "next/link"
import { Providers } from "@/components/Providers"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

export default function VerifyPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
              <p className="text-sm text-gray-500 mt-1">We sent a verification link to your email</p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Please click the link in the email to verify your account and complete your registration.</p>
              <Link href="/auth/login">
                <Button variant="outline">Go to login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Providers>
  )
}
