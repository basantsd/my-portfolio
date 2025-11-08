import { z } from "zod"

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type NewsletterData = z.infer<typeof newsletterSchema>

// Project Schema
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.string().url("Invalid image URL"),
  tags: z.array(z.string()),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["PLANNING", "IN_PROGRESS", "COMPLETED", "UPCOMING"]),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Blog Post Schema
export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: z.string().url("Invalid image URL"),
  tags: z.array(z.string()),
  published: z.boolean().default(false),
})

export type BlogPostFormData = z.infer<typeof blogPostSchema>

// Course Schema
export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  thumbnail: z.string().url("Invalid thumbnail URL"),
  price: z.number().min(0, "Price must be a positive number"),
  isPremium: z.boolean().default(false),
  published: z.boolean().default(false),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
})

export type CourseFormData = z.infer<typeof courseSchema>

// Service Schema
export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().min(1, "Icon is required"),
  features: z.array(z.string()),
  price: z.string().optional(),
  active: z.boolean().default(true),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
