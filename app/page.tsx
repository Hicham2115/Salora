import { Button } from "@/components/ui/button"
import SmoothScroll from "@/components/SmoothScroll"
import Hero from "@/components/MainSection/Hero"
import SaloraDashboardPreview from "@/components/MainSection/SaloraDashboardPreview"
import TheProblem from "@/components/MainSection/TheProblem"
import WhySalora from "@/components/MainSection/WhySalora"
import HowItWorks from "@/components/MainSection/HowItWorks"
import Features from "@/components/MainSection/Features"
import Reviews from "@/components/MainSection/Reviews"
import Pricing from "@/components/MainSection/Pricing"
import FAQ from "@/components/MainSection/FAQ"
import CTA from "@/components/MainSection/CTA"
import Footer from "@/components/MainSection/Footer"

export default function Page() {
  return (
    <div className="font-jakarta">
      <SmoothScroll />
      <Hero />
      <SaloraDashboardPreview />
      <TheProblem />
      <WhySalora />
      <HowItWorks />
      <Features />
      <Reviews />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
