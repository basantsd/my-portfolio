import { db } from "@/lib/db"
import NewsletterClient from "./newsletter-client"

export const dynamic = "force-dynamic"

export default async function NewsletterPage() {
  const subscribers = await db.newsletter.findMany({
    orderBy: {
      subscribedAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
        <p className="text-muted-foreground">
          View and manage newsletter subscriptions
        </p>
      </div>

      <NewsletterClient subscribers={subscribers} />
    </div>
  )
}
