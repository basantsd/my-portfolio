import { db } from "@/lib/db"
import PortfolioClient from "./portfolio-client"

export const dynamic = "force-dynamic"

export default async function PortfolioPage() {
  const projects = await db.project.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" }
    ]
  })

  return <PortfolioClient projects={projects} />
}
