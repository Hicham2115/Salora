import { CalendarPlus, Clock, ShieldCheck, Star } from "lucide-react"
import React from "react"

const problems = [
  {
    number: "01",
    title: "Missed calls = lost revenue",
    description:
      "When you're with a client, your phone rings. You miss it. They book somewhere else. It happens 10+ times a week.",
  },
  {
    number: "02",
    title: "WhatsApp chaos",
    description:
      "Juggling 30 conversations, confirming times, rescheduling — it's a full-time job on top of your real work.",
  },
  {
    number: "03",
    title: "No-shows with zero accountability",
    description:
      "Clients ghost. You lose the slot. The chair sits empty. No reminder was sent, no deposit was taken.",
  },
  {
    number: "04",
    title: "Zero visibility into your business",
    description:
      "You have no idea which services make the most money, which clients are regulars, or how busy next week actually is.",
  },
]

export default function TheProblem() {
  return (
    <section className="mt-17 bg-[#1c4232] px-6 py-24 text-white">
      <div className="relative -top-17 mx-auto grid w-full max-w-6xl grid-cols-2 justify-items-center gap-4 md:grid-cols-4">
        <span className="flex items-center gap-3">
          <span className="rounded-md bg-white/20 p-2">
            <ShieldCheck size={16} />
          </span>
          <span className="font-sans text-sm font-semibold tracking-wide text-white">
            300+ salons onboarded
          </span>
        </span>

        <span className="flex items-center gap-3">
          <span className="rounded-md bg-white/20 p-2">
            <CalendarPlus size={16} />
          </span>
          <span className="font-sans text-sm font-semibold tracking-wide text-white">
            50,000+ bookings processed
          </span>
        </span>

        <span className="flex items-center gap-3">
          <span className="rounded-md bg-white/20 p-2">
            <Star size={16} />
          </span>
          <span className="font-sans text-sm font-semibold tracking-wide text-white">
            4.9/5 average rating
          </span>
        </span>

        <span className="flex items-center gap-3">
          <span className="rounded-md bg-white/20 p-2">
            <Clock size={16} />
          </span>
          <span className="font-sans text-sm font-semibold tracking-wide text-white">
            Setup in under 5 minutes
          </span>
        </span>
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest text-white/50 uppercase">
            <span className="inline-block h-px w-8 bg-white/40" />
            The Problem
          </p>
          <h2 className="max-w-lg text-4xl leading-tight font-black md:text-5xl">
            Running on WhatsApp
            <br />
            is costing you clients
          </h2>
          <p className="mt-4 text-white/60">
            Every salon owner in Morocco knows these problems.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {problems.map((p) => (
            <div
              key={p.number}
              className="rounded-xl border border-white/10 bg-white/5 p-8"
            >
              <p className="mb-4 text-5xl font-black text-white/20">
                {p.number}
              </p>
              <h3 className="mb-2 text-lg font-bold text-white">{p.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
