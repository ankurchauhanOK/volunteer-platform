"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Get started with basic access",
    features: [
      "Browse volunteer opportunities",
      "Create your profile",
      "Apply to opportunities",
      "Basic messaging",
      "Community access",
    ],
    cta: "Get Started",
    href: "/auth/login",
    popular: false,
  },
  {
    name: "Premium",
    price: "₹999",
    period: "/year",
    desc: "For serious volunteers",
    features: [
      "Everything in Free",
      "Priority applications",
      "Verified badge",
      "Emergency refund guarantee",
      "Travel insurance coverage",
      "Priority support",
      "Exclusive host access",
    ],
    cta: "Go Premium",
    href: "/auth/login",
    popular: true,
  },
  {
    name: "Host Boost",
    price: "Free",
    period: "",
    desc: "For hosts listing opportunities",
    features: [
      "Unlimited listings",
      "Applicant management",
      "Messaging system",
      "Reviews & ratings",
      "Verification badge",
      "Analytics dashboard",
      "Priority listing placement",
    ],
    cta: "Become a Host",
    href: "/auth/login",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen py-12">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
              <p className="text-gray-500 max-w-xl mx-auto">Start for free. Upgrade when you need more. Hosts always list for free.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <Card key={plan.name} className={`relative ${plan.popular ? "ring-2 ring-brand-500 shadow-lg scale-[1.02]" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="success" size="md">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-3 mb-2">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-sm text-gray-500">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.href}>
                      <Button
                        variant={plan.popular ? "default" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> All plans are currently free during our launch phase. Premium features will be introduced as we grow.
                  We&apos;ll always keep basic access free for volunteers and hosts.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </AppShell>
  )
}
