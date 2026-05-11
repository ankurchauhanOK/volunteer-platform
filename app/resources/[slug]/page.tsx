"use client"

import { use } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

const articles: Record<string, { title: string; content: string; category: string }> = {
  "getting-started": {
    title: "Getting Started with Volunteer Travel",
    category: "Guide",
    content: "Volunteer travel is one of the most rewarding ways to explore new places. You get to immerse yourself in local culture, make meaningful connections, and contribute to communities — all while keeping your travel costs low.\n\n## Step 1: Create Your Profile\nSign up as a volunteer and complete your profile. Highlight your skills, interests, and availability so hosts can find the right match.\n\n## Step 2: Browse Opportunities\nUse our search and filters to find opportunities that match your interests. Look for listings in destinations you've always wanted to visit.\n\n## Step 3: Apply\nSend a thoughtful application explaining why you're interested and what skills you bring. Be honest about your availability.\n\n## Step 4: Connect with Your Host\nOnce accepted, communicate with your host to coordinate logistics, ask questions, and set expectations.\n\n## Step 5: Travel and Make a Difference\nShow up with an open mind, contribute your best, and soak in every moment of your volunteer-travel experience.",
  },
  "safety-tips": {
    title: "Safety Tips for Solo Women Travelers",
    category: "Safety",
    content: "India is a beautiful and diverse country that welcomes millions of travelers every year. With the right preparation, solo women travelers can have safe and enriching experiences.\n\n## Before You Go\n- Research your destination thoroughly\n- Share your itinerary with family or friends\n- Save emergency contacts locally\n- Download offline maps\n\n## During Your Stay\n- Trust your instincts\n- Dress modestly when visiting religious sites\n- Use reputable transportation\n- Keep your host informed of your whereabouts\n- Stay in well-reviewed accommodations\n\n## Our Platform's Safety Features\n- All hosts are verified\n- Emergency contact system\n- 24/7 support line\n- Community reviews and ratings\n- Code of conduct enforced",
  },
  "visa-guide": {
    title: "Visa Guide for Volunteering in India",
    category: "Travel",
    content: "International volunteers coming to India need to understand the visa requirements.\n\n## E-Visa (Short Term)\nMost nationalities can apply for an e-Tourist Visa online, valid for 60 days with double entry. This is suitable for short volunteer stays.\n\n## Employment Visa\nFor longer teaching or specialized projects, you may need an Employment Visa with an invitation letter from the host organization.\n\n## Important Notes\n- We recommend consulting the official Indian visa website\n- Hosts can provide invitation letters if needed\n- Ensure your passport has at least 6 months validity\n- Apply at least 2-4 weeks before your travel date",
  },
  "cultural-etiquette": {
    title: "Cultural Etiquette in India",
    category: "Culture",
    content: "India's rich cultural diversity is one of its greatest treasures. Understanding local customs will enrich your experience.\n\n## Greetings\n- Namaste (hands pressed together) is a respectful greeting\n- Handshakes are common in cities\n\n## Dress Code\n- Dress modestly, especially in rural areas and religious sites\n- Remove shoes before entering temples and homes\n\n## Dining\n- Eat with your right hand (left hand is considered unclean)\n- Always accept food and drink when offered\n- Vegetarian options are widely available\n\n## General Tips\n- Ask permission before taking photos of people\n- Be patient with bureaucracy and delays\n- Learn a few words in Hindi — it goes a long way",
  },
  "sustainable-travel": {
    title: "Sustainable Travel Tips",
    category: "Environment",
    content: "Travel sustainably to minimize your impact on the environment and local communities.\n\n## Reduce Plastic\n- Carry a reusable water bottle with a filter\n- Bring a reusable bag for shopping\n- Say no to plastic straws\n\n## Support Local\n- Eat at local restaurants\n- Buy from local artisans\n- Choose homestays over large hotel chains\n\n## Respect Wildlife\n- Don't feed or touch wild animals\n- Avoid attractions that exploit animals\n- Choose eco-friendly activities\n\n## Leave No Trace\n- Carry out what you carry in\n- Use designated waste bins\n- Participate in clean-up activities",
  },
  "packing-list": {
    title: "Ultimate Volunteer Packing List",
    category: "Guide",
    content: "Packing smartly can make or break your volunteer experience. Here's what we recommend:\n\n## Essential Documents\n- Passport and visas\n- Travel insurance documents\n- Emergency contact information\n- Copies of important documents\n\n## Clothing\n- Lightweight, breathable clothes\n- Modest clothing for religious sites\n- Warm layer for mountain regions\n- Comfortable walking shoes\n- Rain jacket\n\n## Toiletries\n- Biodegradable soap and shampoo\n- Sunscreen and insect repellent\n- Basic first aid kit\n- Hand sanitizer\n\n## Electronics\n- Phone and charger\n- Power bank\n- Universal adapter\n- Headlamp or flashlight\n\n## Extras\n- Reusable water bottle\n- Small gifts for host family\n- Journal and pen\n- Dry bag",
  },
  "host-tips": {
    title: "How to Be a Great Host",
    category: "Hosts",
    content: "Creating a positive experience for volunteers benefits everyone. Here are our top tips:\n\n## Set Clear Expectations\n- Clearly describe tasks and working hours\n- Outline accommodation and meals provided\n- Communicate house rules upfront\n\n## Welcome and Orient\n- Greet volunteers warmly upon arrival\n- Give a tour of the facilities\n- Introduce them to the team\n- Provide local information and maps\n\n## Communicate Openly\n- Check in regularly with your volunteers\n- Provide feedback on their work\n- Be approachable and responsive\n\n## Respect Boundaries\n- Remember volunteers are guests, not employees\n- Respect their time off\n- Create a safe and inclusive environment\n\n## Share Your Culture\n- Teach them local customs and traditions\n- Share meals together\n- Encourage language exchange",
  },
  "volunteer-stories": {
    title: "Volunteer Stories: Life-Changing Encounters",
    category: "Community",
    content: "Every volunteer has a unique story. Here are some experiences shared by our community members.\n\n\"I spent three weeks in a mountain hostel in Manali and it completely changed my perspective on travel. I made friends from six different countries, learned to make authentic Himachali food, and discovered a confidence I didn't know I had.\"\n— Priya, 24\n\n\"As a retired teacher, I wanted to use my skills meaningfully. Volunteering at a village school in Uttarakhand was incredibly fulfilling. The children's enthusiasm was contagious, and the host family treated me like their own.\"\n— James, 62\n\n\"I was nervous about traveling solo as a woman, but Voluntree's verified hosts gave me peace of mind. My host in Kerala was incredibly welcoming, and the work at the eco-farm was both challenging and rewarding.\"\n— Aisha, 27",
  },
}

export default function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = articles[slug]

  if (!article) {
    return (
      <AppShell>
        <Container className="py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h1>
          <p className="text-gray-500 mb-6">The resource you're looking for doesn't exist.</p>
          <Link href="/resources"><Button>Back to Resources</Button></Link>
        </Container>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link href="/resources" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back to Resources
            </Link>
            <Card>
              <CardContent className="p-8">
                <p className="text-xs font-medium text-brand-600 uppercase tracking-wider mb-2">{article.category}</p>
                <h1 className="font-tanker text-2xl md:text-3xl text-text mb-6">{article.title}</h1>
                <div className="prose prose-sm prose-gray max-w-none">
                  {article.content.split("\n\n").map((paragraph, i) => {
                    if (paragraph.startsWith("## ")) {
                      return <h2 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace("## ", "")}</h2>
                    }
                    if (paragraph.startsWith("- ")) {
                      return (
                        <ul key={i} className="list-disc pl-5 space-y-1 my-2">
                          {paragraph.split("\n").map((line, j) => (
                            <li key={j} className="text-sm text-gray-600">{line.replace("- ", "")}</li>
                          ))}
                        </ul>
                      )
                    }
                    if (paragraph.startsWith("\"")) {
                      return <blockquote key={i} className="border-l-4 border-brand-300 pl-4 italic text-gray-600 my-4 text-sm">{paragraph}</blockquote>
                    }
                    return <p key={i} className="text-sm text-gray-600 leading-relaxed mb-4">{paragraph}</p>
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </AppShell>
  )
}
