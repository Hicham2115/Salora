import React from "react"

function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-[#e8e2da] px-4 py-2 font-jakarta text-sm font-semibold text-black shadow-sm">
        <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
        Trusted by 300+ salons across Morocco
      </div>

      {/* Heading */}
      <h1 className="max-w-6xl text-6xl leading-tight font-black tracking-tight md:text-7xl lg:text-[5rem]">
        {" "}
        <span className="text-[#1a1a1a]">The </span>
        <span className="text-primary">#1 Booking</span>
        <br />
        <span className="text-primary">Platform</span>
        <br />
        <span className="text-[#1a1a1a]">For Moroccan Salons</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground md:text-lg">
        Stop losing clients to missed calls and WhatsApp chaos.
        <br />
        Let them book online, 24/7 — while you focus on what you do best.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Start free for 14 days
          <span>→</span>
        </button>
        <button className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-transparent px-8 py-4 text-base font-semibold text-[#1a1a1a] shadow-sm transition-colors hover:bg-muted">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#1a1a1a] text-xs">
            ▶
          </span>
          See how it works
        </button>
      </div>

      {/* Trust line */}
      <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 text-sm text-muted-foreground">
        <span>No credit card required</span>
        <span className="opacity-40">·</span>
        <span>14-day free trial</span>
        <span className="opacity-40">·</span>
        <span>Setup in 5 minutes</span>
      </p>
    </section>
  )
}

export default Hero
