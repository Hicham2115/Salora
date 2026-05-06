import { Button } from "@/components/ui/button"
import Hero from "@/components/MainSection/Hero"
import SalonFlowDashboardPreview from "@/components/MainSection/SalonFlowDashboardPreview"
import TheProblem from "@/components/MainSection/TheProblem"
import WhySalonFlow from "@/components/MainSection/WhySalonFlow"
export default function Page() {
  return (
    <div className="font-jakarta">
      <Hero />
      <SalonFlowDashboardPreview />
      <TheProblem />
      <WhySalonFlow />
    </div>
  )
}
