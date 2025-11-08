import { Badge } from "@/components/ui/badge"

const techStack = {
  "Blockchain": ["Solidity", "Ethereum", "Polygon", "Hardhat", "Truffle", "Foundry"],
  "Frontend": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Web3.js", "Ethers.js"],
  "Backend": ["Node.js", "Express", "PostgreSQL", "MongoDB", "Prisma"],
  "Tools": ["Git", "Docker", "IPFS", "The Graph", "Chainlink", "OpenZeppelin"],
}

export function TechStackSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Tech Stack
          </h2>
          <p className="text-lg text-muted-foreground">
            Technologies and tools I work with
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {Object.entries(techStack).map(([category, technologies]) => (
            <div key={category}>
              <h3 className="mb-4 text-xl font-semibold">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
