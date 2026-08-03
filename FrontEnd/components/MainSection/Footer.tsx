import { Logo } from "@/components/Logo"

const links: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms of service", href: "/terms-of-service" },
    { label: "Cookie policy", href: "/cookie-policy" },
  ],
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-background px-6 py-16 text-white">
      {/* Gradient top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-105 w-180 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Top row */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm leading-relaxed text-white/90">
              The #1 booking platform for Moroccan salons. Manage bookings,
              clients, and your online presence — all in one place.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="relative mb-5 inline-block text-xs font-semibold tracking-widest text-white uppercase after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-6 after:rounded-full after:bg-primary after:content-['']">
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-white/80 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-linear-to-r from-white/10 via-white/10 to-transparent" />

        {/* Bottom row */}
        <div className="flex flex-col gap-3 text-xs text-white/90 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Salora. Made with care in Morocco</p>
          <p className="text-white/50">
            <span className="text-md text-primary"> Salora</span> — booking,
            simplified.
          </p>
        </div>
      </div>
    </footer>
  )
}
