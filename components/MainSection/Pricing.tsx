const plans = [
  {
    name: "Starter",
    price: 0,
    description: "Everything you need to get started. Free forever.",
    features: [
      "1 staff member",
      "Up to 30 bookings/month",
      "Public booking page",
      "Basic client management",
      "Email notifications",
    ],
    cta: "Get started free",
    popular: false,
    dark: false,
  },
  {
    name: "Pro",
    price: 199,
    description: "The full toolkit for serious salon owners.",
    features: [
      "Up to 5 staff members",
      "Unlimited bookings",
      "SMS & WhatsApp reminders",
      "Portfolio & gallery",
      "Full client management",
      "Revenue analytics",
      "Payment tracking",
    ],
    cta: "Start 14-day free trial",
    popular: true,
    dark: true,
  },
  {
    name: "Business",
    price: 399,
    description: "For multi-staff salons that need full control.",
    features: [
      "Unlimited staff",
      "Unlimited bookings",
      "Priority support",
      "Custom branding",
      "Advanced analytics",
      "Deposit payments",
    ],
    cta: "Contact sales",
    popular: false,
    dark: false,
  },
]

function Check({ dark }: { dark: boolean }) {
  return (
    <svg
      className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-white/70" : "text-[#1c4232]"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#f5f0e8] px-6 py-24">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold tracking-widest text-[#1c4232] uppercase">
            <span className="inline-block h-px w-8 bg-[#1c4232]" />
            Pricing
          </p>
          <h2 className="text-4xl font-black text-[#111] md:text-5xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-[#6b6b6b]">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.dark
                  ? "bg-[#1c4232] text-white shadow-xl md:-my-4 md:py-12"
                  : "bg-white text-[#111]"
              }`}
            >
              {/* Most popular badge */}
              {plan.popular && (
                <span className="absolute top-6 right-6 rounded-full bg-[#a8c5a0] px-3 py-1 text-xs font-semibold text-[#1c4232]">
                  Most Popular
                </span>
              )}

              {/* Plan name */}
              <p className={`mb-4 text-xs font-semibold tracking-widest uppercase ${plan.dark ? "text-white/50" : "text-[#6b6b6b]"}`}>
                {plan.name}
              </p>

              {/* Price */}
              <div className="mb-2 flex items-end gap-1">
                <span className={`text-sm font-semibold ${plan.dark ? "text-white/60" : "text-[#6b6b6b]"}`}>MAD</span>
                <span className="text-6xl font-black leading-none">{plan.price}</span>
                <span className={`mb-1.5 text-sm ${plan.dark ? "text-white/60" : "text-[#6b6b6b]"}`}>/mo</span>
              </div>

              <p className={`mb-8 text-sm leading-relaxed ${plan.dark ? "text-white/60" : "text-[#6b6b6b]"}`}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="mb-10 flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check dark={plan.dark} />
                    <span className={plan.dark ? "text-white/80" : "text-[#444]"}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`mt-auto w-full rounded-xl py-3.5 text-sm font-bold transition-opacity hover:opacity-90 ${
                  plan.dark
                    ? "bg-white text-[#1c4232]"
                    : "bg-[#f0ebe1] text-[#111]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-[#6b6b6b]">
          All plans include a 14-day free trial. No credit card required.
        </p>

      </div>
    </section>
  )
}
