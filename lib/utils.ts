export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

export const hostTypeLabels: Record<string, string> = {
  hostel: "Hostel",
  homestay: "Homestay",
  "eco-lodge": "Eco Lodge",
  cafe: "Cafe / Restaurant",
  restaurant: "Restaurant",
  ngo: "NGO / Project",
  farm: "Farm",
  "community-center": "Community Center",
  school: "School",
  other: "Other",
}

export const skillOptions = [
  "teaching", "farming", "hospitality", "social media", "photography",
  "video", "animal care", "yoga", "language", "cooking",
  "content writing", "graphic design", "web development", "music",
  "art", "dance", "sports", "english", "marketing", "events",
]

export const interestOptions = [
  "trekking", "photography", "yoga", "cooking", "music",
  "art", "reading", "writing", "dancing", "sports",
  "meditation", "film making", "bird watching", "rafting",
]

export const destinationOptions = [
  "Himachal Pradesh", "Uttarakhand", "Kerala", "Goa", "Rajasthan",
  "Sikkim", "Ladakh", "Karnataka", "Tamil Nadu", "Maharashtra",
  "Meghalaya", "Andaman Islands", "Haryana", "Punjab", "Delhi NCR",
]

export const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Ladakh", "Jammu & Kashmir",
]

export const categoryOptions = [
  "hostel", "homestay", "eco-lodge", "cafe", "restaurant",
  "ngo", "farm", "community-center", "school", "other",
]

export const applicationStatusLabels: Record<string, { label: string; color: string }> = {
  drafted: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700" },
  viewed: { label: "Viewed", color: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-700" },
  rejected: { label: "Declined", color: "bg-red-100 text-red-700" },
  waitlisted: { label: "Waitlisted", color: "bg-purple-100 text-purple-700" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-700" },
  confirmed: { label: "Confirmed", color: "bg-emerald-100 text-emerald-700" },
}

export const listingVisibilityLabels: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  published: { label: "Published", color: "bg-green-100 text-green-700" },
  archived: { label: "Archived", color: "bg-orange-100 text-orange-700" },
}
