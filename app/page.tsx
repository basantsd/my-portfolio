import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { ServicesSection } from "@/components/home/services-section"
import { TechStackSection } from "@/components/home/tech-stack-section"
import { CTASection } from "@/components/home/cta-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProjects />
      <ServicesSection />
      <TechStackSection />
      <CTASection />
    </>
  )
}
