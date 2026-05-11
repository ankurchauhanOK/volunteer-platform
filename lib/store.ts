import type {
  User, VolunteerProfile, HostProfile, OpportunityListing,
  Application, Message, MessageThread, Review, Badge,
  Notification, Report, SavedListing, VerificationDocument, Booking
} from "./types"

const STORAGE_PREFIX = "vt_"

function getItem<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_PREFIX + key)
  return data ? JSON.parse(data) : []
}

function setItem<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export const db = {
  users: {
    list: () => getItem<User>("users"),
    find: (id: string) => getItem<User>("users").find(u => u.id === id),
    findByEmail: (email: string) => getItem<User>("users").find(u => u.email === email),
    create: (data: Omit<User, "id" | "createdAt">) => {
      const users = getItem<User>("users")
      const user = { ...data, id: generateId(), createdAt: new Date().toISOString() }
      users.push(user)
      setItem("users", users)
      return user
    },
    update: (id: string, data: Partial<User>) => {
      const users = getItem<User>("users")
      const idx = users.findIndex(u => u.id === id)
      if (idx === -1) return null
      users[idx] = { ...users[idx], ...data }
      setItem("users", users)
      return users[idx]
    },
    delete: (id: string) => {
      const users = getItem<User>("users")
      setItem("users", users.filter(u => u.id !== id))
    },
  },

  volunteerProfiles: {
    list: () => getItem<VolunteerProfile>("volunteerProfiles"),
    find: (userId: string) => getItem<VolunteerProfile>("volunteerProfiles").find(p => p.userId === userId),
    upsert: (data: VolunteerProfile) => {
      const profiles = getItem<VolunteerProfile>("volunteerProfiles")
      const idx = profiles.findIndex(p => p.userId === data.userId)
      if (idx === -1) profiles.push(data)
      else profiles[idx] = data
      setItem("volunteerProfiles", profiles)
      return data
    },
  },

  hostProfiles: {
    list: () => getItem<HostProfile>("hostProfiles"),
    find: (userId: string) => getItem<HostProfile>("hostProfiles").find(p => p.userId === userId),
    upsert: (data: HostProfile) => {
      const profiles = getItem<HostProfile>("hostProfiles")
      const idx = profiles.findIndex(p => p.userId === data.userId)
      if (idx === -1) profiles.push(data)
      else profiles[idx] = data
      setItem("hostProfiles", profiles)
      return data
    },
  },

  listings: {
    list: () => getItem<OpportunityListing>("listings"),
    find: (id: string) => getItem<OpportunityListing>("listings").find(l => l.id === id),
    findByHost: (hostId: string) => getItem<OpportunityListing>("listings").filter(l => l.hostId === hostId),
    create: (data: Omit<OpportunityListing, "id" | "createdAt" | "updatedAt">) => {
      const listings = getItem<OpportunityListing>("listings")
      const now = new Date().toISOString()
      const listing = { ...data, id: generateId(), createdAt: now, updatedAt: now }
      listings.push(listing)
      setItem("listings", listings)
      return listing
    },
    update: (id: string, data: Partial<OpportunityListing>) => {
      const listings = getItem<OpportunityListing>("listings")
      const idx = listings.findIndex(l => l.id === id)
      if (idx === -1) return null
      listings[idx] = { ...listings[idx], ...data, updatedAt: new Date().toISOString() }
      setItem("listings", listings)
      return listings[idx]
    },
    delete: (id: string) => {
      const listings = getItem<OpportunityListing>("listings")
      setItem("listings", listings.filter(l => l.id !== id))
    },
  },

  applications: {
    list: () => getItem<Application>("applications"),
    find: (id: string) => getItem<Application>("applications").find(a => a.id === id),
    findByVolunteer: (volunteerId: string) =>
      getItem<Application>("applications").filter(a => a.volunteerId === volunteerId),
    findByListing: (listingId: string) =>
      getItem<Application>("applications").filter(a => a.listingId === listingId),
    findByHost: (hostId: string) =>
      getItem<Application>("applications").filter(a => a.hostId === hostId),
    create: (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
      const apps = getItem<Application>("applications")
      const now = new Date().toISOString()
      const app = { ...data, id: generateId(), createdAt: now, updatedAt: now }
      apps.push(app)
      setItem("applications", apps)
      return app
    },
    update: (id: string, data: Partial<Application>) => {
      const apps = getItem<Application>("applications")
      const idx = apps.findIndex(a => a.id === id)
      if (idx === -1) return null
      apps[idx] = { ...apps[idx], ...data, updatedAt: new Date().toISOString() }
      setItem("applications", apps)
      return apps[idx]
    },
  },

  threads: {
    list: () => getItem<MessageThread>("threads"),
    find: (id: string) => getItem<MessageThread>("threads").find(t => t.id === id),
    findByUser: (userId: string) =>
      getItem<MessageThread>("threads").filter(t => t.participants.includes(userId)),
    create: (data: Omit<MessageThread, "id" | "createdAt">) => {
      const threads = getItem<MessageThread>("threads")
      const thread = { ...data, id: generateId(), createdAt: new Date().toISOString() }
      threads.push(thread)
      setItem("threads", threads)
      return thread
    },
    update: (id: string, data: Partial<MessageThread>) => {
      const threads = getItem<MessageThread>("threads")
      const idx = threads.findIndex(t => t.id === id)
      if (idx === -1) return null
      threads[idx] = { ...threads[idx], ...data }
      setItem("threads", threads)
      return threads[idx]
    },
  },

  messages: {
    list: () => getItem<Message>("messages"),
    findByThread: (threadId: string) =>
      getItem<Message>("messages").filter(m => m.threadId === threadId),
    create: (data: Omit<Message, "id" | "createdAt">) => {
      const messages = getItem<Message>("messages")
      const msg = { ...data, id: generateId(), createdAt: new Date().toISOString() }
      messages.push(msg)
      setItem("messages", messages)
      return msg
    },
    markRead: (threadId: string, userId: string) => {
      const messages = getItem<Message>("messages")
      messages.forEach(m => {
        if (m.threadId === threadId && m.senderId !== userId) m.read = true
      })
      setItem("messages", messages)
    },
    unreadCount: (threadId: string, userId: string) =>
      getItem<Message>("messages").filter(m => m.threadId === threadId && m.senderId !== userId && !m.read).length,
  },

  reviews: {
    list: () => getItem<Review>("reviews"),
    findByUser: (userId: string) => getItem<Review>("reviews").filter(r => r.toUserId === userId),
    findByListing: (listingId: string) => getItem<Review>("reviews").filter(r => r.listingId === listingId),
    create: (data: Omit<Review, "id" | "createdAt">) => {
      const reviews = getItem<Review>("reviews")
      const review = { ...data, id: generateId(), createdAt: new Date().toISOString() }
      reviews.push(review)
      setItem("reviews", reviews)
      return review
    },
  },

  badges: {
    list: () => getItem<Badge>("badges"),
    findByUser: (userId: string) => getItem<Badge>("badges").filter(b => b.userId === userId),
    create: (data: Omit<Badge, "id" | "awardedAt">) => {
      const badges = getItem<Badge>("badges")
      const badge = { ...data, id: generateId(), awardedAt: new Date().toISOString() }
      badges.push(badge)
      setItem("badges", badges)
      return badge
    },
  },

  notifications: {
    list: () => getItem<Notification>("notifications"),
    findByUser: (userId: string) =>
      getItem<Notification>("notifications").filter(n => n.userId === userId),
    create: (data: Omit<Notification, "id" | "createdAt">) => {
      const notifications = getItem<Notification>("notifications")
      const notif = { ...data, id: generateId(), createdAt: new Date().toISOString() }
      notifications.push(notif)
      setItem("notifications", notifications)
      return notif
    },
    markRead: (id: string) => {
      const notifications = getItem<Notification>("notifications")
      const n = notifications.find(n => n.id === id)
      if (n) n.read = true
      setItem("notifications", notifications)
    },
    markAllRead: (userId: string) => {
      const notifications = getItem<Notification>("notifications")
      notifications.forEach(n => { if (n.userId === userId) n.read = true })
      setItem("notifications", notifications)
    },
    unreadCount: (userId: string) =>
      getItem<Notification>("notifications").filter(n => n.userId === userId && !n.read).length,
  },

  reports: {
    list: () => getItem<Report>("reports"),
    find: (id: string) => getItem<Report>("reports").find(r => r.id === id),
    create: (data: Omit<Report, "id" | "createdAt">) => {
      const reports = getItem<Report>("reports")
      const report = { ...data, id: generateId(), createdAt: new Date().toISOString() }
      reports.push(report)
      setItem("reports", reports)
      return report
    },
    update: (id: string, data: Partial<Report>) => {
      const reports = getItem<Report>("reports")
      const idx = reports.findIndex(r => r.id === id)
      if (idx === -1) return null
      reports[idx] = { ...reports[idx], ...data }
      setItem("reports", reports)
      return reports[idx]
    },
  },

  savedListings: {
    list: () => getItem<SavedListing>("savedListings"),
    findByUser: (userId: string) => getItem<SavedListing>("savedListings").filter(s => s.userId === userId),
    isSaved: (userId: string, listingId: string) =>
      getItem<SavedListing>("savedListings").some(s => s.userId === userId && s.listingId === listingId),
    toggle: (userId: string, listingId: string) => {
      const saved = getItem<SavedListing>("savedListings")
      const idx = saved.findIndex(s => s.userId === userId && s.listingId === listingId)
      if (idx === -1) {
        saved.push({ userId, listingId, savedAt: new Date().toISOString() })
      } else {
        saved.splice(idx, 1)
      }
      setItem("savedListings", saved)
    },
  },

  verificationDocs: {
    list: () => getItem<VerificationDocument>("verificationDocs"),
    findByUser: (userId: string) => getItem<VerificationDocument>("verificationDocs").filter(d => d.userId === userId),
    create: (data: Omit<VerificationDocument, "id" | "uploadedAt">) => {
      const docs = getItem<VerificationDocument>("verificationDocs")
      const doc = { ...data, id: generateId(), uploadedAt: new Date().toISOString() }
      docs.push(doc)
      setItem("verificationDocs", docs)
      return doc
    },
  },

  bookings: {
    list: () => getItem<Booking>("bookings"),
    findByVolunteer: (volunteerId: string) =>
      getItem<Booking>("bookings").filter(b => b.volunteerId === volunteerId),
    findByHost: (hostId: string) =>
      getItem<Booking>("bookings").filter(b => b.hostId === hostId),
    create: (data: Omit<Booking, "id" | "createdAt">) => {
      const bookings = getItem<Booking>("bookings")
      const booking = { ...data, id: generateId(), createdAt: new Date().toISOString() }
      bookings.push(booking)
      setItem("bookings", bookings)
      return booking
    },
  },

  getUnreadMessageCount: (userId: string): number => {
    const threads = getItem<MessageThread>("threads").filter(t => t.participants.includes(userId))
    const messages = getItem<Message>("messages")
    let count = 0
    for (const thread of threads) {
      count += messages.filter(m => m.threadId === thread.id && m.senderId !== userId && !m.read).length
    }
    return count
  },

  seed: () => {
    if (getItem<User>("users").length > 0) return

    db.users.create({
      email: "admin@voluntree.in",
      password: "admin123!",
      name: "Admin",
      role: "admin",
      onboardingComplete: true,
    })

    const hostUser = db.users.create({
      email: "host@example.com",
      password: "host123!",
      name: "Mountain View Hostel",
      role: "host",
      phone: "+91-9876543210",
      onboardingComplete: true,
    })

    const volUser = db.users.create({
      email: "volunteer@example.com",
      password: "vol123!",
      name: "Priya Sharma",
      role: "volunteer",
      phone: "+91-9876543211",
      onboardingComplete: true,
    })

    db.hostProfiles.upsert({
      userId: hostUser.id,
      hostType: "hostel",
      businessName: "Mountain View Hostel & Cafe",
      contactPerson: "Rajesh Kumar",
      description: "A cozy mountain hostel in the heart of Himachal Pradesh. We offer stunning views, warm meals, and a chance to connect with fellow travelers from around the world.",
      location: "Old Manali Road, Manali",
      city: "Manali",
      state: "Himachal Pradesh",
      facilities: ["dormitory", "private room", "wifi", "hot water", "common area", "cafe"],
      photos: [],
      verificationStatus: "verified",
      houseRules: ["No alcohol", "Quiet hours 10pm-7am", "No smoking indoors"],
      languages: ["Hindi", "English", "Punjabi"],
      amenities: ["wifi", "breakfast", "laundry", "luggage storage"],
    })

    db.hostProfiles.upsert({
      userId: hostUser.id,
      hostType: "cafe",
      businessName: "Riverside Cafe",
      contactPerson: "Rajesh Kumar",
      description: "Popular cafe by the river needing help with social media and serving.",
      location: "River Road, Manali",
      city: "Manali",
      state: "Himachal Pradesh",
      facilities: ["cafe", "outdoor seating", "wifi"],
      photos: [],
      verificationStatus: "verified",
      houseRules: ["Clean as you go", "Be punctual"],
      languages: ["Hindi", "English"],
      amenities: ["wifi", "staff meals"],
    })

    db.volunteerProfiles.upsert({
      userId: volUser.id,
      age: 24,
      gender: "female",
      city: "Mumbai",
      country: "India",
      bio: "Adventurous soul who loves travel, photography, and making a difference.",
      languages: ["Hindi", "English", "Marathi"],
      skills: ["photography", "social media", "teaching", "content writing"],
      travelExperience: "Traveled to 8 states in India solo",
      interests: ["trekking", "photography", "yoga", "cooking"],
      preferredDestinations: ["Himachal", "Uttarakhand", "Kerala", "Sikkim"],
      travelStyle: "solo",
      emergencyContact: { name: "Amit Sharma", phone: "+91-9876543212", relation: "Brother" },
      profileCompleteness: 100,
    })

    const listing1 = db.listings.create({
      hostId: hostUser.id,
      title: "Help us run our mountain hostel in Manali",
      category: "hostel",
      location: "Old Manali Road, Manali, Himachal Pradesh",
      city: "Manali",
      state: "Himachal Pradesh",
      description: "Looking for enthusiastic travelers to help with reception, guest activities, and light maintenance at our popular mountain hostel. You'll get to interact with international travelers, practice your English, and enjoy the beautiful Himalayan views.",
      tasks: ["Guest check-in/check-out", "Social media posts", "Organize group activities", "Light cleaning"],
      skillsRequired: ["english", "hospitality", "social media"],
      workingHours: "4-5 hours per day",
      stayDuration: "2-4 weeks",
      accommodationDetails: "Shared dormitory bed with locker. Breakfast and dinner included.",
      mealsIncluded: true,
      internetAvailable: true,
      safetyNotes: "Located in safe tourist area. Staff available 24/7.",
      photos: [],
      volunteerCapacity: 3,
      houseRules: ["No smoking indoors", "Quiet after 10pm", "Respect guest privacy"],
      applicationQuestions: ["Why do you want to volunteer here?", "What skills can you bring?", "When are you available?"],
      tags: ["mountain", "hostel", "social", "hospitality"],
      visibility: "published",
      womenFriendly: true,
      creativeTasks: true,
      ecoProject: false,
    })

    const listing2 = db.listings.create({
      hostId: hostUser.id,
      title: "Social media & content creation for riverside cafe",
      category: "cafe",
      location: "River Road, Manali, Himachal Pradesh",
      city: "Manali",
      state: "Himachal Pradesh",
      description: "Help our vibrant riverside cafe grow its online presence! We need a creative volunteer to capture the beauty of our location and create engaging content for Instagram and other platforms.",
      tasks: ["Take photos of food and ambience", "Create Instagram stories", "Write blog posts", "Engage with followers"],
      skillsRequired: ["photography", "social media", "content writing"],
      workingHours: "3-4 hours per day",
      stayDuration: "2-3 weeks",
      accommodationDetails: "Private room in staff quarters. All meals provided.",
      mealsIncluded: true,
      internetAvailable: true,
      safetyNotes: "",
      photos: [],
      volunteerCapacity: 1,
      houseRules: ["Be creative!", "Share your content with us"],
      applicationQuestions: ["Share your Instagram/portfolio", "What content ideas do you have?"],
      tags: ["creative", "cafe", "content", "photography"],
      visibility: "published",
      womenFriendly: true,
      creativeTasks: true,
      ecoProject: false,
    })

    const listing3 = db.listings.create({
      hostId: hostUser.id,
      title: "Organic farm stay & eco-living experience",
      category: "farm",
      location: "Naggar, Himachal Pradesh",
      city: "Naggar",
      state: "Himachal Pradesh",
      description: "Join our organic farm in the serene Kullu Valley. Learn about permaculture, sustainable farming, and enjoy farm-to-table living. Perfect for those wanting to disconnect and reconnect with nature.",
      tasks: ["Planting and harvesting", "Compost management", "Animal care", "Farm maintenance"],
      skillsRequired: ["farming", "gardening", "physical work"],
      workingHours: "4-5 hours per day",
      stayDuration: "3-6 weeks",
      accommodationDetails: "Eco-cottage with basic amenities. All organic meals provided.",
      mealsIncluded: true,
      internetAvailable: false,
      safetyNotes: "Remote location. Nearest town is 5km away.",
      photos: [],
      volunteerCapacity: 4,
      houseRules: ["Minimal waste", "Respect nature", "No plastic"],
      applicationQuestions: ["Do you have farming experience?", "Are you comfortable with basic living conditions?"],
      tags: ["farm", "eco", "organic", "nature"],
      visibility: "published",
      womenFriendly: true,
      creativeTasks: false,
      ecoProject: true,
    })

    db.reviews.create({
      fromUserId: volUser.id,
      toUserId: hostUser.id,
      listingId: listing1.id,
      applicationId: "seed",
      rating: 5,
      communication: 5,
      safety: 5,
      cleanliness: 4,
      overall: 5,
      content: "Amazing experience! Rajesh is a wonderful host. The work was fair and the location is breathtaking. Highly recommend for first-time volunteers.",
      moderated: false,
    })
  },
}
