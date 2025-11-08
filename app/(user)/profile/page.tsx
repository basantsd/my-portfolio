import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import ProfileClient from "./profile-client"

export const dynamic = "force-dynamic"

export default async function UserProfilePage() {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/profile")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
      enrollments: {
        include: {
          course: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return <ProfileClient user={user} />
}
