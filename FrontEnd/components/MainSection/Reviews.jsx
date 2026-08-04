import { Reveal } from "@/components/Reveal"

const reviews = [
  {
    name: "Karim Benali",
    salon: "Barber Studio K — Casablanca",
    avatar: "KB",
    rating: 5,
    text: "I used to lose 3–4 bookings a week just from missed calls. Since Salora, my calendar fills itself. I haven't touched WhatsApp for bookings in two months.",
    highlight: true,
  },
  {
    name: "Youssef Tazi",
    salon: "Prestige Cut — Rabat",
    avatar: "YT",
    rating: 5,
    text: "Setup took me 8 minutes. My clients love the booking page — they share it on their own. No-shows dropped massively after the reminders kicked in.",
    highlight: false,
  },
  {
    name: "Nadia Alami",
    salon: "Nadia Beauty — Marrakech",
    avatar: "NA",
    rating: 5,
    text: "As a woman running a salon alone, I needed something simple. Salora is exactly that. I see my whole week in one glance and my clients feel taken care of.",
    highlight: false,
  },
  {
    name: "Hassan Moukrim",
    salon: "The Fade Room — Agadir",
    avatar: "HM",
    rating: 5,
    text: "The revenue tracking changed how I run my business. I found out my most profitable service wasn't what I thought. That alone was worth it.",
    highlight: false,
  },
  {
    name: "Aicha Bensouda",
    salon: "Studio Aicha — Fès",
    avatar: "AB",
    rating: 5,
    text: "My clients book at midnight, on Sundays, while I'm sleeping. I wake up to a full schedule. That's what Salora gives you — freedom.",
    highlight: false,
  },
  // {
  //   name: "Omar Cherkaoui",
  //   salon: "Classic Gents — Tangier",
  //   avatar: "OC",
  //   rating: 5,
  //   text: "Switched from a paper diary in January. Can't imagine going back. The client history alone saves me 20 minutes a day — I know exactly what each person wants.",
  //   highlight: false,
  // },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-primary" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const featured = reviews[0]
  const rest = reviews.slice(1)

  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Reveal className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest text-primary uppercase">
              <span className="inline-block h-px w-8 bg-primary/50" />
              Real salon owners
            </p>
            <h2 className="text-4xl leading-tight font-black text-white md:text-5xl">
              They switched.
              <br />
              They never looked back.
            </h2>
          </div>
          <div className="flex gap-8 md:text-right">
            <div>
              <p className="text-3xl font-black text-primary">
                4.9<span className="text-lg text-muted-foreground">/5</span>
              </p>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </div>
            <div>
              <p className="text-3xl font-black text-primary">300+</p>
              <p className="text-xs text-muted-foreground">Salons onboarded</p>
            </div>
            <div>
              <p className="text-3xl font-black text-primary">98%</p>
              <p className="text-xs text-muted-foreground">Would recommend</p>
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Featured review — accent card, spans 1 col but taller */}
          <Reveal className="md:row-span-2">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-primary/30 bg-card p-8 text-white transition-colors duration-200 hover:border-primary/60">
              <div>
                <Stars count={featured.rating} />
                <p className="mt-6 text-lg leading-relaxed font-medium text-white/90">
                  &ldquo;{featured.text}&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  {featured.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {featured.name}
                  </p>
                  <p className="text-xs text-white/50">{featured.salon}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Regular review cards */}
          {rest.map((r, i) => (
            <Reveal delay={i * 80} key={r.name}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-card p-7 transition-all duration-200 hover:-translate-y-1 hover:border-white/20">
                <div>
                  <Stars count={r.rating} />
                  <p className="mt-4 text-sm leading-relaxed text-white/80">
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.salon}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
