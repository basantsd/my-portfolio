import { db } from "@/lib/db"
import ContactsClient from "./contacts-client"

export const dynamic = "force-dynamic"

export default async function ContactsPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground">
          View and manage contact form submissions
        </p>
      </div>

      <ContactsClient messages={messages} />
    </div>
  )
}
