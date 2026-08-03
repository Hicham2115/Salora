import { Reveal } from "@/components/Reveal"

const steps = [
  {
    number: 1,
    title: "Create your account",
    description:
      "Sign up with Google, Facebook, or your phone number. Free for 14 days.",
  },
  {
    number: 2,
    title: "Set up your salon",
    description:
      "Add your services, prices, working hours, and photos. Takes 5 minutes.",
  },
  {
    number: 3,
    title: "Share your link",
    description:
      "Get your public booking page. Share it on Instagram, WhatsApp bio, or Google.",
  },
  {
    number: 4,
    title: "Bookings roll in",
    description:
      "Clients book 24/7. You get notified instantly. Reminders are sent automatically.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <Reveal className="mb-16 text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold tracking-widest text-primary uppercase">
            <span className="inline-block h-px w-8 bg-primary/50" />
            How it works
          </p>
          <h2 className="text-4xl font-black text-white md:text-5xl">
            Up and running in 5 minutes
          </h2>
          <p className="mt-4 text-muted-foreground">
            No tech skills needed. If you can use WhatsApp, you can use Salora.
          </p>
        </Reveal>

        {/* Steps */}
        <div className="relative grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {/* Connecting line */}
          <div className="absolute top-[22px] left-0 hidden h-px w-full bg-white/10 md:block" />

          {steps.map((step, i) => (
            <Reveal delay={i * 100} key={step.number}>
              <div className="group relative flex flex-col items-center px-4 text-center">
                {/* Numbered circle */}
                <div className="relative z-10 mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform duration-200 group-hover:scale-110">
                  {step.number}
                </div>
                <h3 className="mb-2 text-base font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
