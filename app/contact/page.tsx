"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
              <p className="text-gray-500 mt-2">Have a question, feedback, or need help? We&apos;re here for you.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", title: "Phone Support", desc: "+91-1800-123-VOLUNTREE" },
                { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", title: "Email", desc: "hello@voluntree.in" },
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-gray-900">Send us a message</h2></CardHeader>
              <CardContent>
                {sent ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Message sent!</h3>
                    <p className="text-sm text-gray-500">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Name" id="name" required />
                      <Input label="Email" type="email" id="email" required />
                    </div>
                    <Select label="Category" id="category" options={[
                      { value: "general", label: "General Inquiry" },
                      { value: "support", label: "Support" },
                      { value: "report", label: "Report an Issue" },
                      { value: "partnership", label: "Partnership" },
                      { value: "feedback", label: "Feedback" },
                    ]} placeholder="Select category" />
                    <Textarea label="Message" id="message" required />
                    <Button type="submit" className="w-full">Send Message</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </AppShell>
  )
}
