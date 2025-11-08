import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { contactFormSchema } from "@/lib/validations"

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = contactFormSchema.parse(body)

    // Save to database
    const message = await db.contactMessage.create({
      data: validated,
    })

    // TODO: Send email notification
    // await sendEmail({
    //   to: process.env.EMAIL_FROM!,
    //   subject: `New Contact: ${validated.subject}`,
    //   html: `
    //     <h2>New Contact Message</h2>
    //     <p><strong>From:</strong> ${validated.name} (${validated.email})</p>
    //     <p><strong>Subject:</strong> ${validated.subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${validated.message}</p>
    //   `,
    // })

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

// GET /api/contact - Get all contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}
