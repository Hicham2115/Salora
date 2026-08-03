import { ArrowRight, CircleCheck } from "lucide-react"
import { Reveal } from "@/components/Reveal"

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-card px-6 py-28 text-white">
      {/* Glow accents */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <Reveal className="relative mx-auto max-w-3xl text-center">
        <p className="mb-6 flex items-center justify-center gap-3 text-xs font-semibold tracking-widest text-primary uppercase">
          <span className="inline-block h-px w-8 bg-linear-to-r from-transparent to-primary/70" />
          Start today
          <span className="inline-block h-px w-8 bg-linear-to-l from-transparent to-primary/70" />
        </p>

        <h2 className="mb-6 text-4xl leading-tight font-black md:text-6xl">
          Your salon deserves
          <br />
          better than <span className="text-primary">WhatsApp</span>
        </h2>

        <p className="mb-10 text-base leading-relaxed text-white/60">
          Join 300+ Moroccan salons already running on Salora.
          <br />
          It takes 5 minutes to set up and zero to risk.
        </p>

        <button className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 active:scale-95">
          Get started free — no card needed
          <ArrowRight
            className="transition-transform duration-200 group-hover:translate-x-1"
            size={18}
          />
        </button>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <CircleCheck className="text-primary" size={14} />
            14-day free trial
          </span>
          <span className="flex items-center gap-1.5">
            <CircleCheck className="text-primary" size={14} />
            Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <CircleCheck className="text-primary" size={14} />
            Setup in 5 minutes
          </span>
        </div>
      </Reveal>
    </section>
  )
}
