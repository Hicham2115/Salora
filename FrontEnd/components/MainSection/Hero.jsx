"use client"
import { SignUpButton } from "@clerk/nextjs"
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  CircleCheck,
  Gift,
  Play,
  Scissors,
  ShieldCheck,
  Star,
  User,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import heroImage from "@/app/assets/hero.png"

const features = [
  {
    title: "Online Booking 24/7",
    description: "Let your clients book anytime, even while you sleep.",
    icon: Calendar,
  },
  {
    title: "Smart Reminders",
    description: "Automatic SMS or WhatsApp reminders reduce no-shows.",
    icon: Bell,
  },
  {
    title: "Business Insights",
    description: "Track bookings, revenue and top services easily.",
    icon: BarChart3,
  },
  {
    title: "Grow Your Business",
    description: "More bookings, happier clients, higher profits.",
    icon: Users,
  },
]

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"]

function Hero() {
  return (
    <section className="overflow-hidden bg-background px-6 pt-16 pb-16 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-8">
        {/* Left column */}
        <div className="flex flex-col items-start text-left">
          {/* Badges */}
          <div className="mb-8 flex flex-col items-start gap-3">
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-card px-4 py-2 font-jakarta text-sm font-semibold text-white shadow-sm">
              <Star className="fill-primary text-primary" size={14} />
              Trusted by 300+ salons across Morocco
            </div> */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-jakarta text-sm font-semibold text-primary shadow-sm">
              <Gift size={14} />
              The first 50 salons to join get unlimited access for life
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl leading-[1.05] font-black tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-white">The </span>
            <span className="text-primary">#1 Booking</span>
            <br />
            <span className="text-primary">Platform</span>
            <br />
            <span className="text-white">For Moroccan Salons</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            Stop losing clients to missed calls and WhatsApp chaos.
            <br />
            Let them book online, 24/7 — while you focus on what you do best.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link href="/sign-up">
              <button className="group flex cursor-pointer items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0 active:scale-95">
                <Calendar size={18} />
                Start free for 14 days
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </Link>

            <button className="group flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-transparent px-5 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none active:translate-y-0 active:scale-[0.98]">
              <span className="flex h-5 w-5 items-center justify-center transition-colors duration-200">
                <Play className="ml-0.5 fill-current" size={13} />
              </span>
              See how it works
            </button>
          </div>

          {/* Trust line */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CircleCheck className="text-primary" size={16} />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CircleCheck className="text-primary" size={16} />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <CircleCheck className="text-primary" size={16} />
              Setup in 5 minutes
            </span>
          </div>
        </div>

        {/* Right column — image + booking widget */}
        <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
          <div className="group relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src={heroImage}
              alt="Modern salon interior"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* <div className="absolute top-6 right-4 w-64 rounded-2xl border border-white/10 bg-card p-4 shadow-2xl sm:right-6 sm:w-72">
            <p className="mb-3 text-sm font-semibold text-white">
              Book Your Appointment
            </p>

            <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#1a1a1a] p-3">
              <div className="flex items-center gap-2">
                <Scissors className="text-primary" size={16} />
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Select Service
                  </p>
                  <p className="text-sm font-medium text-white">
                    Haircut & Styling
                  </p>
                </div>
              </div>
              <ChevronDown className="text-muted-foreground" size={16} />
            </div>

            <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#1a1a1a] p-3">
              <div className="flex items-center gap-2">
                <User className="text-primary" size={16} />
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Select Stylist
                  </p>
                  <p className="text-sm font-medium text-white">Sara</p>
                </div>
              </div>
              <ChevronDown className="text-muted-foreground" size={16} />
            </div>

            <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#1a1a1a] p-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" size={16} />
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Select Date
                  </p>
                  <p className="text-sm font-medium text-white">
                    Today, 10:00 AM
                  </p>
                </div>
              </div>
            </div>

            <p className="mb-2 text-[11px] text-muted-foreground">
              Available Time
            </p>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <span
                  className={`rounded-md py-1.5 text-center text-xs font-medium ${
                    slot === "10:00"
                      ? "bg-primary text-primary-foreground"
                      : "bg-[#1a1a1a] text-muted-foreground"
                  }`}
                  key={slot}
                >
                  {slot}
                </span>
              ))}
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Book Now
              <span>→</span>
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="text-primary" size={13} />
              Secure & Easy Booking
            </p>
          </div> */}
        </div>
      </div>

      {/* Feature strip */}
      <div className="mx-auto mt-16 max-w-6xl rounded-2xl border border-white/10 bg-card p-6 md:mt-24 md:p-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              className="group flex items-start gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5"
              key={title}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 transition-transform duration-200 group-hover:scale-110">
                <Icon className="text-primary" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
