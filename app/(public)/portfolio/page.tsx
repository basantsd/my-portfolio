"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, ExternalLink, Search } from "lucide-react"

const projects = [
  {
    id: "1",
    title: "DeFi Lending Protocol",
    slug: "defi-lending-protocol",
    description: "A decentralized lending platform built on Ethereum with automated market-making and liquidity pools. Features include flash loans, collateral management, and yield farming.",
    tags: ["Solidity", "Ethereum", "DeFi", "React", "Hardhat"],
    githubUrl: "#",
    liveUrl: "#",
    status: "COMPLETED" as const,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: "NFT Marketplace",
    slug: "nft-marketplace",
    description: "Full-stack NFT marketplace with minting, trading, and royalty management features. Supports ERC-721 and ERC-1155 standards with IPFS storage.",
    tags: ["Solidity", "IPFS", "Next.js", "Web3", "TheGraph"],
    githubUrl: "#",
    liveUrl: "#",
    status: "COMPLETED" as const,
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: "DAO Governance Platform",
    slug: "dao-governance",
    description: "Decentralized governance platform with proposal creation, voting, and treasury management. Implements timelock and multi-signature functionality.",
    tags: ["Solidity", "Hardhat", "TypeScript", "DAO", "OpenZeppelin"],
    githubUrl: "#",
    liveUrl: "#",
    status: "IN_PROGRESS" as const,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Token Vesting Contract",
    slug: "token-vesting",
    description: "Secure token vesting smart contract with cliff periods, linear vesting, and revocation functionality for team and investor token distribution.",
    tags: ["Solidity", "Security", "ERC-20", "Foundry"],
    githubUrl: "#",
    liveUrl: "#",
    status: "COMPLETED" as const,
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: "Cross-Chain Bridge",
    slug: "cross-chain-bridge",
    description: "Bridge protocol for transferring assets between Ethereum and Polygon. Features include liquidity pools, fee optimization, and security mechanisms.",
    tags: ["Solidity", "Polygon", "Bridge", "Security"],
    githubUrl: "#",
    liveUrl: "#",
    status: "COMPLETED" as const,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Yield Farming Protocol",
    slug: "yield-farming",
    description: "DeFi yield farming protocol with staking, rewards distribution, and auto-compounding features. Optimized for gas efficiency.",
    tags: ["Solidity", "DeFi", "Staking", "Gas Optimization"],
    githubUrl: "#",
    liveUrl: "#",
    status: "UPCOMING" as const,
    image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=600&fit=crop",
  },
]

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Get all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  )

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || project.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">Portfolio</h1>
        <p className="text-lg text-muted-foreground">
          Explore my blockchain and Web3 projects
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="group overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <Badge
                  variant={
                    project.status === "COMPLETED"
                      ? "default"
                      : project.status === "IN_PROGRESS"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {project.status.replace("_", " ")}
                </Badge>
              </div>
              <CardDescription className="line-clamp-3">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
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

      {filteredProjects.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No projects found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}
