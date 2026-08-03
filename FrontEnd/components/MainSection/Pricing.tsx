import { Reveal } from "@/components/Reveal"

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
    price: 100,
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
    price: 299,
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

function Check() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
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
    <section id="pricing" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <Reveal className="mb-14 text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold tracking-widest text-primary uppercase">
            <span className="inline-block h-px w-8 bg-primary/50" />
            Pricing
          </p>
          <h2 className="text-4xl font-black text-white md:text-5xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal delay={i * 100} key={plan.name} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 text-white transition-all duration-200 hover:-translate-y-1 ${
                  plan.dark
                    ? "border-primary bg-card shadow-xl shadow-primary/10 hover:shadow-primary/20 md:-my-4 md:py-12"
                    : "border-white/10 bg-card hover:border-white/20"
                }`}
              >
                {/* Most popular badge */}
                {plan.popular && (
                  <span className="absolute top-6 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                )}

                {/* Plan name */}
                <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {plan.name}
                </p>

                {/* Price */}
                <div className="mb-2 flex items-end gap-1">
                  <span className="text-sm font-semibold text-muted-foreground">
                    MAD
                  </span>
                  <span className="text-6xl leading-none font-black">
                    {plan.price}
                  </span>
                  <span className="mb-1.5 text-sm text-muted-foreground">
                    /mo
                  </span>
                </div>

                <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="mb-10 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check />
                      <span className="text-white/80">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`mt-auto w-full cursor-pointer rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
                    plan.dark
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  )
}
