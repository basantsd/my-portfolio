import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import BlogPostClient from "./blog-post-client"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await db.blogPost.findUnique({
    where: { slug }
  })

  if (!post || !post.published) {
    notFound()
  }

  // Increment views
  await db.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })

  // Get related posts (same tags)
  const relatedPosts = await db.blogPost.findMany({
    where: {
      published: true,
      id: { not: post.id },
      tags: {
        hasSome: post.tags
      }
    },
    take: 3,
    orderBy: {
      createdAt: "desc"
    }
  })

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}
