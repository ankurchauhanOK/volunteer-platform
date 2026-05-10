"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Card, CardContent } from "@/components/ui/Card"

const faqs = [
  { q: "How does Voluntree work?", a: "Voluntree connects travelers (volunteers) with hosts who need help. Volunteers browse opportunities, apply to ones that match their skills, and if accepted, stay with the host in exchange for a few hours of work per day. Accommodation and meals are typically provided for free." },
  { q: "Is Voluntree free to join?", a: "Yes! Signing up as a volunteer or host is completely free during our launch phase. We may introduce premium plans in the future, but basic memberships will always remain free." },
  { q: "Who can join as a volunteer?", a: "Anyone 18 years or older can join. We welcome travelers from India and around the world. You don't need specific qualifications — just enthusiasm and a willingness to help." },
  { q: "Who can become a host?", a: "Any legitimate business, organization, or individual with a genuine need for help can become a host. This includes hostels, homestays, cafes, restaurants, farms, NGOs, schools, and community centers." },
  { q: "How are hosts verified?", a: "We verify hosts through identity checks, business documentation, and community reviews. Verified hosts receive a special badge on their profile, giving volunteers extra confidence." },
  { q: "Is it safe for solo women travelers?", a: "Safety is our top priority. We verify all hosts, provide emergency contact information, and have a dedicated support team. Many of our hosts are specifically women-friendly. Always read reviews and communicate with your host before traveling." },
  { q: "What kind of work will I do?", a: "Tasks vary by host. Common activities include reception duties, social media management, teaching, farming, cooking, cleaning, content creation, and event organization. The exact tasks are listed in each opportunity description." },
  { q: "How many hours per day do I work?", a: "Most opportunities require 3-5 hours of work per day, leaving you plenty of time to explore and relax. The exact hours are specified in each listing." },
  { q: "Do I get accommodation and meals?", a: "In most cases, yes. Hosts typically provide free accommodation and meals in exchange for your help. Check the listing details for what's included." },
  { q: "Can I volunteer with a friend or partner?", a: "Absolutely! Some hosts can accommodate multiple volunteers. Check the capacity listed in the opportunity, and mention in your application that you'd like to come with someone." },
  { q: "What if something goes wrong during my stay?", a: "We have a support team ready to help. You can report issues through our platform, and we'll work to resolve them. We also have a host responsibility agreement and code of conduct." },
  { q: "Do I need travel insurance?", a: "While not mandatory, we strongly recommend getting travel insurance for peace of mind. Some of our premium plans may include insurance coverage in the future." },
  { q: "Can I leave a review?", a: "Yes! After your stay, both volunteers and hosts can leave reviews. This helps maintain trust and quality in our community." },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
              <p className="text-gray-500 mt-2">Everything you need to know about Voluntree</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <Card key={i}>
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${openIndex === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openIndex === i && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </AppShell>
  )
}
