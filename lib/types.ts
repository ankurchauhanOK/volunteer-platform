export type UserRole = "volunteer" | "host" | "admin"

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: string
  onboardingComplete: boolean
}

export interface PromptAnswer {
  promptId: string
  promptText: string
  answer: string
}

export interface VolunteerProfile {
  userId: string
  profilePhoto?: string
  age?: number
  gender?: string
  city?: string
  country?: string
  bio?: string
  languages: string[]
  skills: string[]
  travelExperience?: string
  interests: string[]
  preferredDestinations: string[]
  availabilityStart?: string
  availabilityEnd?: string
  travelStyle?: string
  emergencyContact?: { name: string; phone: string; relation: string }
  cvUrl?: string
  profileCompleteness: number

  // New onboarding fields
  qualification?: string
  talentAreas?: string[]
  hobbies?: string[]
  hobbyRepresentation?: string
  hobbyDescription?: string
  hobbyProofUrl?: string
  travelType?: string
  preferredEnvironment?: string[]
  preferredStayType?: string[]
  tripDuration?: string
  soloOrGroup?: string
  experienceLevel?: string
  remoteWork?: boolean
  comfortLevel?: string
  emergencyNotes?: string
  medicalConsiderations?: string
  specialRequirements?: string
  communityGuidelinesAgreed?: boolean
  respectfulConductAgreed?: boolean
  phoneVerified?: boolean
  onboardingStep?: number

  // Personality prompts
  promptAnswers?: PromptAnswer[]
}

export interface HostProfile {
  userId: string
  hostType: string
  businessName?: string
  contactPerson: string
  description?: string
  location: string
  city: string
  state: string
  facilities: string[]
  photos: string[]
  website?: string
  socialLinks?: string[]
  verificationStatus: "unverified" | "pending" | "verified"
  houseRules: string[]
  languages: string[]
  emergencyContact?: { name: string; phone: string }
  amenities: string[]

  // Visual identity fields
  hostPhoto?: string
  propertyVibe?: string[]
  introVideo?: string
  volunteerExperience?: string[]
  volunteerExperienceDesc?: string
}

export interface OpportunityListing {
  id: string
  hostId: string
  title: string
  category: string
  location: string
  city: string
  state: string
  description: string
  tasks: string[]
  skillsRequired: string[]
  workingHours: string
  stayDuration: string
  startDate?: string
  endDate?: string
  accommodationDetails?: string
  mealsIncluded: boolean
  internetAvailable: boolean
  safetyNotes?: string
  photos: string[]
  volunteerCapacity: number
  houseRules: string[]
  applicationQuestions: string[]
  tags: string[]
  visibility: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  womenFriendly: boolean
  creativeTasks: boolean
  ecoProject: boolean
}

export interface Application {
  id: string
  listingId: string
  volunteerId: string
  hostId: string
  message: string
  whyJoin: string
  relevantSkills: string
  availableDates: string
  previousExperience?: string
  attachment?: string
  status: "drafted" | "submitted" | "viewed" | "accepted" | "rejected" | "waitlisted" | "withdrawn" | "confirmed"
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  content: string
  attachment?: string
  createdAt: string
  read: boolean
  isSystem: boolean
}

export interface MessageThread {
  id: string
  participants: string[]
  listingId?: string
  applicationId?: string
  subject: string
  lastMessageAt: string
  createdAt: string
}

export interface Review {
  id: string
  fromUserId: string
  toUserId: string
  listingId: string
  applicationId: string
  rating: number
  communication: number
  safety: number
  cleanliness: number
  overall: number
  content: string
  createdAt: string
  moderated: boolean
}

export interface Badge {
  id: string
  userId: string
  type: string
  name: string
  description: string
  awardedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: string
}

export interface Report {
  id: string
  reporterId: string
  reportedUserId?: string
  reportedListingId?: string
  reason: string
  description: string
  status: "open" | "investigating" | "resolved" | "dismissed"
  createdAt: string
  resolvedAt?: string
}

export interface SavedListing {
  userId: string
  listingId: string
  savedAt: string
}

export interface VerificationDocument {
  id: string
  userId: string
  type: string
  status: "pending" | "approved" | "rejected"
  url: string
  uploadedAt: string
}

export interface Booking {
  id: string
  listingId: string
  volunteerId: string
  hostId: string
  applicationId: string
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed" | "cancelled"
  createdAt: string
}
