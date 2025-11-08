import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Code, Blocks, Shield, Rocket, Award, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const skills = [
    "Solidity Smart Contracts",
    "Ethereum & EVM Chains",
    "DeFi Protocols",
    "NFT Development",
    "Web3.js & Ethers.js",
    "React & Next.js",
    "TypeScript",
    "Node.js",
    "Hardhat & Foundry",
    "Security Auditing",
  ]

  const experience = [
    {
      title: "Senior Blockchain Developer",
      company: "Web3 Innovations",
      period: "2022 - Present",
      description: "Lead developer for DeFi protocols and NFT marketplaces",
      logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop",
    },
    {
      title: "Smart Contract Engineer",
      company: "CryptoTech Solutions",
      period: "2020 - 2022",
      description: "Developed and audited smart contracts for various blockchain projects",
      logo: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=100&h=100&fit=crop",
    },
    {
      title: "Full Stack Developer",
      company: "Tech Startup",
      period: "2018 - 2020",
      description: "Built full-stack applications with modern web technologies",
      logo: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=100&h=100&fit=crop",
    },
  ]

  const achievements = [
    { icon: Code, label: "50+ Smart Contracts Deployed", color: "blue" },
    { icon: Shield, label: "15+ Security Audits Completed", color: "purple" },
    { icon: Rocket, label: "$10M+ TVL Managed", color: "green" },
    { icon: Award, label: "5+ Years Experience", color: "orange" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4">About Me</Badge>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                Building the Future of{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Decentralized Web
                </span>
              </h1>
              <p className="mb-6 text-lg text-muted-foreground">
                I'm Basant Singh Dobal, a passionate blockchain developer with over 5 years
                of experience in building decentralized applications and smart contracts.
              </p>
              <div className="flex gap-4">
                <Button asChild className="shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button variant="outline" asChild className="border-2 hover:scale-105 transition-all">
                  <Link href="/portfolio">View Work</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-2xl"></div>
              <div className="relative rounded-2xl overflow-hidden border-4 border-background shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=600&fit=crop"
                  alt="Blockchain Development"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold">My Journey</h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              My journey in blockchain started with Bitcoin's whitepaper in 2017, and since then,
              I've been fascinated by the potential of decentralized technologies to
              transform industries and empower individuals.
            </p>
            <p>
              I specialize in Ethereum and EVM-compatible chains, with deep expertise in
              Solidity, DeFi protocols, NFT standards, and Web3 integration. I'm committed
              to writing secure, gas-optimized, and well-tested smart contracts.
            </p>
            <p>
              Throughout my career, I've worked on various blockchain projects ranging from
              DeFi protocols handling millions in TVL to NFT marketplaces and DAO governance
              systems. Each project has taught me the importance of security, efficiency, and
              user experience in blockchain development.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Achievements</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <Card key={achievement.label} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-${achievement.color}-100 dark:bg-${achievement.color}-900/30`}>
                      <Icon className={`h-8 w-8 text-${achievement.color}-600 dark:text-${achievement.color}-400`} />
                    </div>
                    <p className="font-semibold">{achievement.label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold">Skills & Expertise</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-4 py-2 text-base hover:scale-105 transition-transform cursor-pointer"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{exp.title}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                        </div>
                        <Badge variant="outline" className="w-fit">{exp.period}</Badge>
                      </div>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold">Education & Certifications</h2>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">B.Tech in Computer Science</p>
                  <p className="text-sm text-muted-foreground">University Name, 2014-2018</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Certified Blockchain Developer</p>
                  <p className="text-sm text-muted-foreground">Blockchain Council</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Smart Contract Security Auditor</p>
                  <p className="text-sm text-muted-foreground">OpenZeppelin</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Let's Work Together</h2>
          <p className="mb-8 text-lg opacity-90">
            Have a blockchain project in mind? Let's discuss how I can help bring it to life.
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-xl hover:scale-105 transition-all">
            <Link href="/contact">Start a Project</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
