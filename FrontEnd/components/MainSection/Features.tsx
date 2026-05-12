const appointments = [
  { time: "09:00", name: "Hamza", service: "Haircut + Beard", duration: "60min", style: "bg-[#1c4232] text-white" },
  { time: "10:30", name: "Karim", service: "Classic Cut", duration: "30min", style: "bg-[#4a7c59] text-white" },
  { time: "11:30", name: "Omar", service: "Premium Shave", duration: "45min", style: "bg-[#e8e0d0] text-[#111]" },
  { time: "14:00", name: "Mehdi", service: "Beard Styling", duration: "30min", style: "bg-[#1c4232] text-white" },
]

export default function Features() {
  return (
    <section id="features" className="bg-[#f0ebe1] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest text-[#1c4232] uppercase">
            <span className="inline-block h-px w-8 bg-[#1c4232]" />
            Features
          </p>
          <h2 className="max-w-xl text-4xl font-black leading-tight text-[#111] md:text-5xl">
            Built for how
            <br />
            your salon actually works
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Large card — Booking Calendar */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-8 md:col-span-2">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-widest text-[#1c4232] uppercase">
                Booking Calendar
              </p>
              <h3 className="mb-3 text-2xl font-black text-[#111]">
                Your day, perfectly organized
              </h3>
              <p className="mb-8 max-w-sm text-sm leading-relaxed text-[#6b6b6b]">
                See all appointments in a clear daily and weekly view. Drag to reschedule. Color-coded by service type. Know who&apos;s coming before they arrive.
              </p>
            </div>

            {/* Calendar preview */}
            <div className="rounded-xl border border-[#e5e0d8] bg-[#faf8f4] p-4">
              <p className="mb-3 text-xs font-semibold text-[#6b6b6b]">Monday, April 28</p>
              <div className="flex flex-col gap-2">
                {appointments.map((a) => (
                  <div
                    key={a.time}
                    className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium ${a.style}`}
                  >
                    <span>
                      <span className="font-bold">{a.time}</span> {a.name} — {a.service}
                    </span>
                    <span className="text-xs opacity-70">· {a.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dark card — Public Page */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#1c4232] p-8 text-white">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">
                Public Page
              </p>
              <h3 className="mb-3 text-2xl font-black leading-tight">
                Your salon, online in seconds
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-white/60">
                A beautiful booking page your clients can find, trust, and book from — instantly.
              </p>
            </div>

            {/* Booking page preview card */}
            <div className="rounded-xl bg-white p-4 text-[#111]">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f5f0e8] text-sm">
                  ✂️
                </span>
                <span className="text-sm font-bold">Salon Prestige — Casablanca</span>
              </div>
              <p className="mb-3 text-xs text-[#6b6b6b]">⭐ 4.9 · 128 reviews · Open now</p>
              <button className="w-full rounded-lg bg-[#111] py-2.5 text-sm font-semibold text-white">
                Book an appointment →
              </button>
            </div>
          </div>

          {/* Bottom 3 cards */}
          <div className="rounded-2xl bg-white p-8">
            <p className="mb-3 text-xs font-semibold tracking-widest text-[#1c4232] uppercase">
              Client Management
            </p>
            <h3 className="mb-2 text-xl font-black text-[#111]">
              Know every client by name
            </h3>
            <p className="text-sm leading-relaxed text-[#6b6b6b]">
              Full history, notes, and preferences for every client. Greet them like a regular, every time.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8">
            <p className="mb-3 text-xs font-semibold tracking-widest text-[#1c4232] uppercase">
              SMS & WhatsApp Reminders
            </p>
            <h3 className="mb-2 text-xl font-black text-[#111]">
              No-shows? Not anymore.
            </h3>
            <p className="text-sm leading-relaxed text-[#6b6b6b]">
              Automatic reminders sent 24h and 1h before each appointment. Reduce no-shows by 60%.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8">
            <p className="mb-3 text-xs font-semibold tracking-widest text-[#1c4232] uppercase">
              Services & Pricing
            </p>
            <h3 className="mb-2 text-xl font-black text-[#111]">
              Your menu, your way
            </h3>
            <p className="text-sm leading-relaxed text-[#6b6b6b]">
              Create service categories, set prices, durations, and assign staff — all in minutes.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
