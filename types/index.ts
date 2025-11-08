// User Types
export type Role = "USER" | "ADMIN"

export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

// Project Types
export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "UPCOMING"

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image: string
  tags: string[]
  githubUrl: string | null
  liveUrl: string | null
  featured: boolean
  status: ProjectStatus
  order: number
  createdAt: Date
  updatedAt: Date
}

// Blog Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  tags: string[]
  published: boolean
  views: number
  readTime: number
  createdAt: Date
  updatedAt: Date
}

// Course Types
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  content: string
  thumbnail: string
  price: number
  isPremium: boolean
  published: boolean
  level: CourseLevel
  duration: number
  createdAt: Date
  updatedAt: Date
  modules?: CourseModule[]
}

export interface CourseModule {
  id: string
  courseId: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string | null
  videoUrl: string
  duration: number
  order: number
  isFree: boolean
}

// Service Types
export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  price: string | null
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

// Subscription Types
export type Plan = "FREE" | "MONTHLY" | "YEARLY"
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED"

export interface Subscription {
  id: string
  userId: string
  plan: Plan
  status: SubscriptionStatus
  startDate: Date
  endDate: Date
}

// Newsletter Types
export interface Newsletter {
  id: string
  email: string
  subscribed: boolean
  subscribedAt: Date
}

// Contact Types
export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: Date
}

// Navigation Types
export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}
