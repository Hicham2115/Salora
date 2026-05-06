export default function CTA() {
  return (
    <section className="bg-[#1c4232] px-6 py-28 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-6 flex items-center justify-center gap-3 text-xs font-semibold tracking-widest text-white/50 uppercase">
          <span className="inline-block h-px w-8 bg-white/30" />
          Start today
        </p>

        <h2 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
          Your salon deserves
          <br />
          better than WhatsApp
        </h2>

        <p className="mb-10 text-base leading-relaxed text-white/60">
          Join 300+ Moroccan salons already running on Salora.
          <br />
          It takes 5 minutes to set up and zero to risk.
        </p>

        <button className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#1c4232] transition-opacity hover:opacity-90">
          Get started free — no card needed →
        </button>

        <p className="mt-6 text-xs text-white/30">
          14-day free trial · Cancel anytime · Setup in 5 minutes
        </p>
      </div>
    </section>
  )
}
