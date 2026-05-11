"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

const articles = [
  { slug: "getting-started", title: "Getting Started with Volunteer Travel", category: "Guide", excerpt: "Everything you need to know before your first volunteer trip.", readTime: "5 min" },
  { slug: "safety-tips", title: "Safety Tips for Solo Women Travelers", category: "Safety", excerpt: "Essential safety advice for women traveling alone in India.", readTime: "7 min" },
  { slug: "visa-guide", title: "Visa Guide for Volunteering in India", category: "Travel", excerpt: "Understanding visa requirements for international volunteers.", readTime: "4 min" },
  { slug: "cultural-etiquette", title: "Cultural Etiquette in India", category: "Culture", excerpt: "Learn about local customs, traditions, and cultural norms.", readTime: "6 min" },
  { slug: "sustainable-travel", title: "Sustainable Travel Tips", category: "Environment", excerpt: "How to minimize your environmental impact while traveling.", readTime: "5 min" },
  { slug: "packing-list", title: "Ultimate Volunteer Packing List", category: "Guide", excerpt: "What to pack for a volunteer trip in India.", readTime: "4 min" },
  { slug: "host-tips", title: "How to Be a Great Host", category: "Hosts", excerpt: "Tips for creating a welcoming experience for volunteers.", readTime: "6 min" },
  { slug: "volunteer-stories", title: "Volunteer Stories: Life-Changing Encounters", category: "Community", excerpt: "Real stories from volunteers who found adventure and purpose.", readTime: "8 min" },
]

export default function ResourcesPage() {
  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="font-tanker text-3xl text-text">Resources</h1>
              <p className="text-gray-500 mt-2">Guides, tips, and stories to help you make the most of your volunteer-travel experience</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {articles.map(article => (
                <Card key={article.slug} hover>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>{article.category}</Badge>
                      <span className="text-xs text-gray-400">{article.readTime} read</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{article.excerpt}</p>
                    <Link href={`/resources/${article.slug}`} className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium mt-3">
                      Read more <span>&rarr;</span>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </AppShell>
  )
}
