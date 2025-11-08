"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Code2, Blocks, Database, Wrench, Sparkles } from "lucide-react"

const techStack = [
  {
    category: "Blockchain",
    icon: Blocks,
    color: "blue",
    technologies: [
      { name: "Solidity", level: "Expert" },
      { name: "Ethereum", level: "Expert" },
      { name: "Polygon", level: "Advanced" },
      { name: "Hardhat", level: "Expert" },
      { name: "Truffle", level: "Advanced" },
      { name: "Foundry", level: "Advanced" },
    ],
  },
  {
    category: "Frontend",
    icon: Code2,
    color: "purple",
    technologies: [
      { name: "React", level: "Expert" },
      { name: "Next.js", level: "Expert" },
      { name: "TypeScript", level: "Expert" },
      { name: "Tailwind CSS", level: "Expert" },
      { name: "Web3.js", level: "Advanced" },
      { name: "Ethers.js", level: "Expert" },
    ],
  },
  {
    category: "Backend",
    icon: Database,
    color: "green",
    technologies: [
      { name: "Node.js", level: "Expert" },
      { name: "Express", level: "Advanced" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "MongoDB", level: "Advanced" },
      { name: "Prisma", level: "Expert" },
    ],
  },
  {
    category: "Tools",
    icon: Wrench,
    color: "orange",
    technologies: [
      { name: "Git", level: "Expert" },
      { name: "Docker", level: "Advanced" },
      { name: "IPFS", level: "Advanced" },
      { name: "The Graph", level: "Advanced" },
      { name: "Chainlink", level: "Advanced" },
      { name: "OpenZeppelin", level: "Expert" },
    ],
  },
]

const getColorClasses = (color: string) => {
  const colors = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      glow: "group-hover:shadow-blue-500/20",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      glow: "group-hover:shadow-purple-500/20",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      glow: "group-hover:shadow-green-500/20",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
      glow: "group-hover:shadow-orange-500/20",
    },
  }
  return colors[color as keyof typeof colors] || colors.blue
}

export function TechStackSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-primary/30">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tech Stack
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with to build cutting-edge blockchain solutions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mx-auto max-w-6xl">
          {techStack.map((stack) => {
            const Icon = stack.icon
            const colors = getColorClasses(stack.color)

            return (
              <Card
                key={stack.category}
                className={`group relative overflow-hidden border-2 ${colors.border} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${colors.glow}`}
              >
                <CardContent className="p-6">
                  {/* Header with icon */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-7 w-7 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{stack.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stack.technologies.length} technologies
                      </p>
                    </div>
                  </div>

                  {/* Technologies grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {stack.technologies.map((tech) => (
                      <div
                        key={tech.name}
                        className="group/tech relative overflow-hidden rounded-lg border bg-background/50 p-3 transition-all hover:shadow-md hover:scale-105"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{tech.name}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${
                                tech.level === "Expert"
                                  ? colors.bg
                                  : i < 2
                                  ? colors.bg
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`mt-1 text-xs ${colors.text} font-medium`}>
                          {tech.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional skills badges */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Additional Skills
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Smart Contract Auditing",
              "Gas Optimization",
              "DeFi Protocols",
              "NFT Standards (ERC-721, ERC-1155)",
              "Web3 Integration",
              "DAO Development",
              "Token Economics",
              "Security Best Practices",
            ].map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-4 py-2 text-sm font-medium hover:scale-110 transition-transform cursor-default shadow-md"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
