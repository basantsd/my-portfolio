"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteBlogButton({ id }: { id: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete post")
      }
    } catch (error) {
      alert("Error deleting post")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
