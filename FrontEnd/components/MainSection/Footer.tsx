import { Menu } from "lucide-react"

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
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
    { label: "Cookie policy", href: "#" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#111f19] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Top row */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                <Menu className="text-white" size={19} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Salora
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/90">
              The #1 booking platform for Moroccan salons. Manage bookings,
              clients, and your online presence — all in one place.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="mb-5 text-xs font-semibold tracking-widest text-white uppercase">
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
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
        <div className="mb-6 h-px bg-white/10" />

        {/* Bottom row */}
        <div className="flex flex-col gap-3 text-xs text-white/90 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Salora. Made with care in Morocco </p>
          <p></p>
        </div>
      </div>
    </footer>
  )
}
