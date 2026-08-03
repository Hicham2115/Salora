import {
  BarChart3,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Heart,
  MessageCircle,
  Scissors,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react"
import Image from "next/image"
import image2 from "@/app/assets/image2.jpeg"
import { Reveal } from "@/components/Reveal"

const features = [
  {
    icon: Calendar,
    title: "Easy Online Booking",
    description: "Let your clients book 24/7 in just a few clicks.",
  },
  {
    icon: Clock,
    title: "No More No-Shows",
    description: "Automated reminders reduce missed appointments.",
  },
  {
    icon: BarChart3,
    title: "Grow Your Business",
    description: "Insights and analytics help you understand and grow faster.",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "Smart AI answers client questions and handles bookings.",
  },
  {
    icon: Smartphone,
    title: "All in One Place",
    description: "Manage appointments, clients, services, and payments easily.",
  },
  {
    icon: Users,
    title: "Better Client Experience",
    description: "Happy clients come back and bring more friends.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Your data and your clients' data are always protected.",
  },
  {
    icon: CreditCard,
    title: "Save Time, Earn More",
    description:
      "Spend less time on scheduling and more time doing what you love.",
  },
]

export default function WhySalora() {
  return (
    <>
      <section className="bg-background px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {/* Header row: copy + image */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <Reveal className="text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase">
                <Star className="fill-primary text-primary" size={14} />
                Why Salora
              </div>
              <h2 className="text-4xl leading-tight font-black md:text-5xl">
                <span className="text-white">Why Salora is the </span>
                <span className="text-primary">smart choice</span>
                <span className="text-white"> for salons</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Salora is more than just a booking tool. It&apos;s your business
                assistant that helps you save time, keep your clients happy, and
                grow your revenue.
              </p>
            </Reveal>

            <Reveal
              delay={150}
              className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none"
            >
              <div className="group relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={image2}
                  alt="Salon professional reviewing bookings"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </Reveal>
          </div>

          {/* Divider */}
          <div className="my-14 flex items-center gap-4">
            <span className="h-px flex-1 border-t border-dashed border-primary/40" />
            <Scissors className="text-primary" size={20} />
            <span className="h-px flex-1 border-t border-dashed border-primary/40" />
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }, i) => (
              <Reveal delay={i * 70} key={title}>
                <div className="h-full rounded-xl border border-white/10 bg-card p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/40">
                  <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                    <Icon className="text-primary" size={20} />
                    {(title === "Grow Your Business" ||
                      title === "AI Assistant") && (
                      <Sparkles
                        className="absolute -top-1 -right-1 text-primary"
                        size={12}
                      />
                    )}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">
                    {title}
                  </h3>
                  <span className="mx-auto mb-3 block h-px w-8 bg-primary/50" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Banner */}
          {/* <div className="mt-8 flex flex-col items-center gap-6 rounded-2xl border border-primary/30 bg-card p-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 sm:flex">
                <Heart className="fill-primary text-primary" size={22} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">
                  Built for your salon.
                </p>
                <p className="text-lg font-bold text-primary">
                  Designed to make you unstoppable.
                </p>
              </div>
            </div>

            <span className="hidden h-14 w-px bg-white/10 md:block" />

            <p className="max-w-sm text-center text-sm text-muted-foreground md:text-left">
              Salora handles the busy work, so you can focus on your craft
              and give your clients the best experience.
            </p>
          </div> */}
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-background px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest text-primary uppercase">
              <span className="inline-block h-px w-8 bg-primary/50" />
              The Comparison
            </p>
            <h2 className="mb-3 text-4xl leading-tight font-black text-white md:text-5xl">
              Salora vs. the old way
            </h2>
            <p className="mb-10 text-muted-foreground">
              See why 300+ salon owners switched from WhatsApp and paper
              diaries.
            </p>
          </Reveal>

          <Reveal
            delay={150}
            className="overflow-hidden rounded-2xl border border-white/10"
          >
            {/* Header */}
            <div className="grid grid-cols-4 bg-primary text-sm font-semibold text-primary-foreground">
              <div className="px-6 py-4">Feature</div>
              <div className="px-6 py-4 text-center">Salora</div>
              <div className="px-6 py-4 text-center">WhatsApp</div>
              <div className="px-6 py-4 text-center">Paper diary</div>
            </div>

            {/* Rows */}
            {[
              {
                feature: "24/7 online booking",
                salora: true,
                whatsapp: false,
                paper: false,
              },
              {
                feature: "Automated reminders",
                salora: true,
                whatsapp: false,
                paper: false,
              },
              {
                feature: "Client history & notes",
                salora: true,
                whatsapp: "partial",
                paper: false,
              },
              {
                feature: "Public booking page",
                salora: true,
                whatsapp: false,
                paper: false,
              },
              {
                feature: "Revenue tracking",
                salora: true,
                whatsapp: false,
                paper: "partial",
              },
              {
                feature: "Staff management",
                salora: true,
                whatsapp: false,
                paper: false,
              },
              {
                feature: "Works while you sleep",
                salora: true,
                whatsapp: false,
                paper: false,
              },
            ].map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-t border-white/10 text-sm transition-colors duration-150 hover:bg-white/5 ${i % 2 === 0 ? "bg-card" : "bg-background"}`}
              >
                <div className="px-6 py-4 font-medium text-white">
                  {row.feature}
                </div>
                {[row.salora, row.whatsapp, row.paper].map((val, j) => (
                  <div
                    key={j}
                    className="flex items-center justify-center px-6 py-4"
                  >
                    {val === true && (
                      <Check
                        size={18}
                        className="text-primary"
                        strokeWidth={2.5}
                      />
                    )}
                    {val === false && (
                      <X size={18} className="text-red-400" strokeWidth={2.5} />
                    )}
                    {val === "partial" && (
                      <span className="text-xs font-semibold text-amber-400">
                        Partial
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  )
}
