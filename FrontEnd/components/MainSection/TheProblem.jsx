import {
  BarChart3,
  Calendar,
  Camera,
  Clock,
  MessageCircle,
  PhoneMissed,
  TriangleAlert,
  User,
  Users,
} from "lucide-react"
import Image from "next/image"
import image1 from "@/app/assets/image1.jpeg"
import { Reveal } from "@/components/Reveal"

const problems = [
  {
    title: "Too many calls & messages",
    description:
      "You or your staff spend hours answering the same questions over and over.",
    icon: PhoneMissed,
  },
  {
    title: "Double bookings & mistakes",
    description:
      "Manual scheduling often leads to double bookings and unhappy clients.",
    icon: Calendar,
  },
  {
    title: "No-shows waste time",
    description:
      "Clients forget or don't show up, leaving empty chairs and lost revenue.",
    icon: Clock,
  },
  {
    title: "No insights or data",
    description:
      "You don't know your busy hours, top services, or real business performance.",
    icon: BarChart3,
  },
  {
    title: "Hard to manage everything",
    description:
      "Walk-ins, calls, and appointments from different places — all over the place.",
    icon: Users,
  },
]

const notifications = [
  {
    label: "Can I book for tomorrow 6 PM?",
    time: "11:02 AM",
    icon: MessageCircle,
    iconClass: "bg-[#25d366] text-white",
  },
  {
    label: "Do you have any slots today?",
    time: "11:05 AM",
    icon: Camera,
    iconClass:
      "bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
  },
  {
    label: "Missed call",
    time: "11:07 AM",
    icon: PhoneMissed,
    iconClass: "bg-white/10 text-white",
  },
  {
    label: "Walk-in customer",
    time: "11:10 AM",
    icon: User,
    iconClass: "bg-white/10 text-white",
  },
]

export default function TheProblem() {
  return (
    <section className="bg-background px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Header row: copy + image */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <Reveal className="text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase">
              <TriangleAlert size={14} />
              The Problem
            </div>
            <h2 className="text-4xl leading-tight font-black md:text-5xl">
              <span className="text-white">Managing appointments </span>
              <span className="text-white">the old way is </span>
              <span className="text-primary">costing you.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Salon owners juggle calls, messages, and walk-ins every day.
              It&apos;s stressful, time-consuming, and leads to missed
              opportunities.
            </p>
          </Reveal>

          <Reveal
            delay={150}
            className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none"
          >
            <div className="group relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={image1}
                alt="Salon owner overwhelmed by calls and messages"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            </div>

            <div className="absolute top-4 left-4 flex w-56 flex-col gap-2 sm:w-64">
              {notifications.map(
                ({ label, time, icon: Icon, iconClass }, i) => (
                  <Reveal delay={300 + i * 100} key={label}>
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-card/95 p-3 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}
                      >
                        <Icon size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white">
                          {label}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {time}
                      </span>
                    </div>
                  </Reveal>
                )
              )}
            </div>
          </Reveal>
        </div>

        {/* Problem cards */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {problems.map(({ title, description, icon: Icon }, i) => (
            <Reveal delay={i * 80} key={title}>
              <div className="h-full rounded-xl border border-white/10 bg-card p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/40">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                  <Icon className="text-primary" size={20} />
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

        {/* Stat banner */}
        <Reveal className="mt-8 flex flex-col items-center gap-6 rounded-2xl border border-primary/30 bg-card p-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 sm:flex">
              <Calendar className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Salon owners lose an average of
              </p>
              <p className="text-2xl font-black text-primary md:text-3xl">
                5–10 hours per week
              </p>
              <p className="text-sm text-muted-foreground">
                managing appointments manually.
              </p>
            </div>
          </div>

          <span className="hidden h-14 w-px bg-white/10 md:block" />

          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-white">
              Focus on what you do best.
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Let Salora handle the booking, so you can focus on your craft
              and growing your business.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
