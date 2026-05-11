import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  "reception", "housekeeping", "event help",
]

export const popularSkills = ["teaching", "hospitality", "social media", "photography", "cooking", "farming"]

export const talentAreaOptions = [
  "arts & crafts", "music & performance", "digital media", "writing & content",
  "culinary arts", "sports & fitness", "wellness & healing", "language & culture",
  "science & research", "nature & environment",
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

// Onboarding constants

export const qualificationOptions = [
  { value: "student", label: "Student" },
  { value: "school-graduate", label: "School Graduate" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "working-professional", label: "Working Professional" },
  { value: "freelancer", label: "Freelancer" },
  { value: "artist", label: "Artist" },
  { value: "creator", label: "Creator" },
  { value: "other", label: "Other" },
]

export const languageOptions = [
  "Hindi", "English", "Marathi", "Bengali", "Tamil", "Telugu",
  "Kannada", "Malayalam", "Gujarati", "Punjabi", "Odia",
  "Assamese", "Urdu", "Sanskrit", "Nepali", "French", "Spanish",
  "German", "Japanese", "Korean", "Mandarin", "Portuguese",
]

export const hobbyOptions = [
  "trekking", "photography", "yoga", "cooking", "music",
  "reading", "writing", "dancing", "meditation", "film making",
  "bird watching", "rafting", "sketching", "painting",
  "gardening", "journaling", "travel storytelling", "pottery",
  "calligraphy", "cycling", "swimming", "surfing",
]

export const hobbyRepresentationOptions = [
  { value: "text", label: "Text", icon: "✍️" },
  { value: "photo", label: "Photo", icon: "📸" },
  { value: "video", label: "Video", icon: "🎥" },
  { value: "audio", label: "Audio", icon: "🎙️" },
  { value: "portfolio", label: "Portfolio Link", icon: "🔗" },
  { value: "mixed", label: "Mixed", icon: "🎨" },
]

export const travelTypeOptions = [
  { value: "budget", label: "Budget Travel", description: "Low-cost, backpacker style" },
  { value: "creative", label: "Creative Travel", description: "Art, content, storytelling" },
  { value: "cultural", label: "Cultural Exchange", description: "Immerse in local culture" },
  { value: "adventure", label: "Adventure Travel", description: "Thrills and outdoor action" },
  { value: "slow", label: "Slow Travel", description: "Long stays, deep connection" },
]

export const environmentOptions = [
  "Mountains", "Beaches", "Villages", "Cities", "Farms",
  "Hostels", "Homestays", "Eco projects",
]

export const stayTypeOptions = [
  "Hostel", "Homestay", "Farm stay", "Cafe stay", "NGO stay", "Eco-lodge",
]

export const tripDurationOptions = [
  { value: "1-3", label: "1 to 3 days" },
  { value: "4-7", label: "4 to 7 days" },
  { value: "1-2weeks", label: "1 to 2 weeks" },
  { value: "2plus", label: "2+ weeks" },
  { value: "flexible", label: "Flexible" },
]

export const soloGroupOptions = [
  { value: "solo", label: "Solo" },
  { value: "with-partner", label: "With partner" },
  { value: "with-friends", label: "With friends" },
  { value: "group", label: "Group" },
]

export const travelStyleOptions = [
  { value: "independent", label: "Independent Traveler" },
  { value: "social", label: "Social Traveler" },
  { value: "creative-explorer", label: "Creative Explorer" },
  { value: "budget-backpacker", label: "Budget Backpacker" },
  { value: "slow-traveler", label: "Slow Traveler" },
  { value: "first-time", label: "First-time Traveler" },
]

export const experienceLevelOptions = [
  { value: "first-time", label: "First time volunteering" },
  { value: "some", label: "Some volunteering experience" },
  { value: "experienced", label: "Experienced volunteer" },
  { value: "frequent", label: "Frequent traveler" },
]

export const comfortLevelOptions = [
  { value: "very-flexible", label: "Very flexible", icon: "🌿" },
  { value: "moderate", label: "Moderate flexibility", icon: "🌱" },
  { value: "some-structure", label: "Need some structure", icon: "🌳" },
  { value: "clear-schedules", label: "Prefer clear schedules", icon: "🏗️" },
]

export const relationshipOptions = [
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" },
  { value: "spouse", label: "Spouse" },
  { value: "guardian", label: "Guardian" },
  { value: "other", label: "Other" },
]

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
  { value: "prefer-not", label: "Prefer not to say" },
]

export const vibeOptions = [
  "Peaceful", "Social", "Backpacker-friendly", "Creative",
  "Nature-focused", "Community-driven", "Spiritual", "Remote-work friendly",
  "Eco-conscious", "Adventure-oriented", "Minimalist", "Cultural",
]

export const experienceOptions = [
  "Mountain life", "Farm work", "Cafe culture", "Hostel community",
  "Yoga sessions", "Hiking", "Cooking together", "Language exchange",
  "Local exploration", "Creative collaboration", "Slow living", "Sustainable lifestyle",
]

export const photoSuggestionLabels = [
  "Exterior view", "Volunteer sleeping area", "Common area",
  "Kitchen/cafe", "Work area", "Bathroom", "Rooftop/garden", "Nearby surroundings",
]

export const indianCityOptions = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow",
  "Chandigarh", "Bhopal", "Indore", "Coimbatore", "Kochi",
  "Visakhapatnam", "Nagpur", "Thiruvananthapuram", "Goa",
  "Shimla", "Manali", "Dharamshala", "Rishikesh", "Haridwar",
  "Varanasi", "Agra", "Udaipur", "Jodhpur", "Amritsar",
  "Guwahati", "Shillong", "Gangtok", "Leh", "Puducherry",
]
