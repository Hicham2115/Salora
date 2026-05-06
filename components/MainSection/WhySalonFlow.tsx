import {
  Calendar,
  Phone,
  Users,
  DollarSign,
  LayoutDashboard,
  Activity,
} from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Online booking, 24/7",
    description:
      "Clients book their own appointments any time of day — no calls, no messages, no friction.",
  },
  {
    icon: Phone,
    title: "Automated reminders",
    description:
      "SMS & WhatsApp reminders sent automatically. No-shows reduced by up to 60%.",
  },
  {
    icon: Users,
    title: "Client management",
    description:
      "Full client history, notes, preferences — know every client like a regular, even if you just met them.",
  },
  {
    icon: DollarSign,
    title: "Payment tracking",
    description:
      "Track paid, unpaid, and deposit-paid bookings. Never lose track of what's owed.",
  },
  {
    icon: LayoutDashboard,
    title: "Public booking page",
    description:
      "Your own professional page — share the link on Instagram, WhatsApp, or Google. Looks premium.",
  },
  {
    icon: Activity,
    title: "Business insights",
    description:
      "See your busiest hours, top services, and revenue trends at a glance. Make smarter decisions.",
  },
]

export default function WhySalonFlow() {
  return (
    <section className="bg-[#f5f0e8] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest text-[#1c4232] uppercase">
            <span className="inline-block h-px w-8 bg-[#1c4232]" />
            Why SalonFlow
          </p>
          <h2 className="max-w-2xl text-4xl leading-tight font-black text-[#111] md:text-5xl">
            Everything your salon needs.
            <br />
            Nothing it doesn't.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border-primary bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-t-4 hover:shadow-md"
            >
              <div className="mb-6 inline-flex rounded-xl bg-[#f5f0e8] p-3">
                <f.icon size={22} strokeWidth={1.5} className="text-[#111]" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#111]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#6b6b6b]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
