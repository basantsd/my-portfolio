"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, ExternalLink } from "lucide-react"

const projects = [
  {
    id: "1",
    title: "DeFi Lending Protocol",
    description: "A decentralized lending platform built on Ethereum with automated market-making and liquidity pools.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    tags: ["Solidity", "Ethereum", "DeFi", "React"],
    githubUrl: "#",
    liveUrl: "#",
    status: "COMPLETED" as const,
  },
  {
    id: "2",
    title: "NFT Marketplace",
    description: "Full-stack NFT marketplace with minting, trading, and royalty management features.",
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=600&h=400&fit=crop",
    tags: ["Solidity", "IPFS", "Next.js", "Web3"],
    githubUrl: "#",
    liveUrl: "#",
    status: "COMPLETED" as const,
  },
  {
    id: "3",
    title: "DAO Governance Platform",
    description: "Decentralized governance platform with proposal creation, voting, and treasury management.",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop",
    tags: ["Solidity", "Hardhat", "TypeScript", "DAO"],
    githubUrl: "#",
    liveUrl: "#",
    status: "IN_PROGRESS" as const,
  },
]

export function FeaturedProjects() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground">
            Some of my recent blockchain and Web3 projects
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <Badge variant={project.status === "COMPLETED" ? "default" : "secondary"}>
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={project.liveUrl} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/portfolio">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
