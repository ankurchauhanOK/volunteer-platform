"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

export default function HowItWorksPage() {
  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Voluntree Works</h1>
              <p className="text-gray-500 max-w-xl mx-auto">A simple, safe way to travel, volunteer, and make meaningful connections across India.</p>
            </div>

            {/* For Volunteers */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">For Volunteers</h2>
                <div className="space-y-8">
                  {[
                    { step: "1", title: "Create Your Profile", desc: "Sign up and tell us about yourself — your skills, interests, and where you want to go. The more detail you provide, the better hosts can match with you.", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
                    { step: "2", title: "Browse Opportunities", desc: "Explore listings from hosts across India. Filter by location, type of work, duration, and more. Each listing shows exactly what's expected and what's provided.", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
                    { step: "3", title: "Apply", desc: "Send a personalized application telling the host why you're interested and what skills you bring. Hosts typically respond within 48 hours.", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
                    { step: "4", title: "Get Accepted & Communicate", desc: "Once accepted, you can message your host directly to coordinate logistics, ask questions, and start building your connection.", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
                    { step: "5", title: "Travel & Volunteer", desc: "Show up, contribute your skills (typically 3-5 hours/day), enjoy free accommodation and meals, and immerse yourself in a new community.", icon: "M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.591.286 1.357-.2 1.856l-.158.158c-.437.437-.624 1.077-.483 1.695.19.828.057 1.708-.38 2.422l-.307.502c-.468.765-.255 1.742.487 2.21l.543.34c.452.284.681.809.566 1.327l-.13.586c-.155.7.257 1.404.93 1.62 2.045.655 4.224.456 6.086-.647a8.25 8.25 0 003.113-3.162" },
                    { step: "6", title: "Review & Share", desc: "After your stay, leave a review to help the community. Share your experience and inspire others to start their own journey.", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 md:gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold shrink-0">
                          {item.step}
                        </div>
                        {i < 5 && <div className="w-0.5 flex-1 bg-brand-200 mt-2" />}
                      </div>
                      <div className="pb-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link href="/auth/login">
                    <Button size="lg">Start Your Journey</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* For Hosts */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">For Hosts</h2>
                <div className="space-y-8">
                  {[
                    { step: "1", title: "Create Your Host Profile", desc: "Sign up and tell us about your business or project. Add photos, describe your facilities, and set your expectations.", icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" },
                    { step: "2", title: "List Your Opportunity", desc: "Create detailed listings describing the tasks, duration, what you offer (accommodation, meals), and what skills you need.", icon: "M12 4.5v15m7.5-7.5h-15" },
                    { step: "3", title: "Receive Applications", desc: "Review applications from interested volunteers. Each application includes their skills, experience, and why they want to join.", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
                    { step: "4", title: "Accept & Communicate", desc: "Accept the right volunteer and start communicating directly. Coordinate arrival details, share local tips, and build excitement.", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
                    { step: "5", title: "Host & Get Help", desc: "Welcome your volunteer, assign tasks, share meals, and enjoy the cultural exchange. Most volunteers stay 2-4 weeks.", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 md:gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-ocean-100 text-ocean-700 flex items-center justify-center text-sm font-bold shrink-0">
                          {item.step}
                        </div>
                        {i < 4 && <div className="w-0.5 flex-1 bg-ocean-200 mt-2" />}
                      </div>
                      <div className="pb-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link href="/auth/login">
                    <Button variant="secondary" size="lg">Become a Host</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </AppShell>
  )
}
