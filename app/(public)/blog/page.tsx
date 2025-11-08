import { db } from "@/lib/db"
import BlogClient from "./blog-client"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: {
      published: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return <BlogClient posts={posts} />
}
