import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { BlogForm } from "../../blog-form"

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const post = await db.blogPost.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-2">Update blog post details</p>
      </div>
      <BlogForm post={post} />
    </div>
  )
}
