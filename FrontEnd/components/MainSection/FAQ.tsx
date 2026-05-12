"use client"

import { useState } from "react"

const COLORS = {
  primary: "#1B4332",
  primaryLight: "#52B788",
  bg: "#F8F5F0",
  warm: "#F0EDE8",
  border: "#E2DDD8",
  text: "#0D1B14",
  textMuted: "#6B7C74",
}

const FAQ_ITEMS = [
  {
    q: "Is it really free forever?",
    a: "Yes. The first 50 barbers who join get free lifetime access to all Pro features — no subscription, no trial ending, no hidden fees. Ever.",
  },
  {
    q: "How will you contact me?",
    a: "We will reach out via WhatsApp within 48 hours of your application to schedule a personal onboarding call. No spam, no cold emails.",
  },
  {
    q: "Do my clients need to download an app?",
    a: "No. Your clients book directly from your public page in any browser on their phone. Zero friction, zero downloads.",
  },
  {
    q: "What if I already use WhatsApp for bookings?",
    a: "Perfect — you keep using WhatsApp. Salora adds a booking link so clients can self-book, and sends automatic reminders so you don't have to chase them.",
  },
  {
    q: "How long does setup take?",
    a: "Most barbers are fully set up in under 10 minutes. We'll help you on a personal call so nothing goes wrong.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Of course. You own your data, your booking page, and your clients. There is no lock-in. Export everything whenever you want.",
  },
]

function FaqItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "22px 0",
          background: "none",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          fontFamily: "inherit",
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.text,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
        onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.text)}
        aria-expanded={isOpen}
      >
        <span>{q}</span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            flexShrink: 0,
            background: isOpen ? COLORS.primary : COLORS.warm,
            color: isOpen ? "white" : COLORS.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            lineHeight: 1,
            transform: isOpen ? "rotate(45deg)" : "none",
            transition: "all 0.25s ease",
          }}
        >
          +
        </div>
      </button>
      <div
        style={{
          maxHeight: isOpen ? 240 : 0,
          overflow: "hidden",
          transition:
            "max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease",
          paddingBottom: isOpen ? 22 : 0,
          opacity: isOpen ? 1 : 0,
          fontSize: 15,
          color: COLORS.textMuted,
          lineHeight: 1.7,
        }}
      >
        {a}
      </div>
    </div>
  )
}

export default function SalonFlowFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section
      id="faq"
      style={{
        padding: "96px 48px",
        background: COLORS.bg,
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
        color: COLORS.text,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: COLORS.primary,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 24,
                height: 2,
                background: COLORS.primaryLight,
                borderRadius: 2,
              }}
            />
            FAQ
            <div
              style={{
                width: 24,
                height: 2,
                background: COLORS.primaryLight,
                borderRadius: 2,
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              letterSpacing: "-1px",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Quick answers
          </h2>
          <p
            style={{
              fontSize: 16,
              color: COLORS.textMuted,
              marginTop: 12,
              maxWidth: 480,
              margin: "12px auto 0",
              lineHeight: 1.6,
            }}
          >
            Everything you need to know before joining the waitlist.
          </p>
        </div>

        {/* List */}
        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div
          style={{
            marginTop: 48,
            padding: "28px 32px",
            background: "white",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: 17,
                marginBottom: 4,
              }}
            >
              Still have questions?
            </div>
            <div style={{ fontSize: 14, color: COLORS.textMuted }}>
              Talk to us directly on WhatsApp — we reply within hours.
            </div>
          </div>
          <a
            href="https://wa.me/212682211228"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 22px",
              background: COLORS.primary,
              border: "none",
              borderRadius: 10,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "background 0.15s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4z M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 12-5.4 12-12S18.6 0 12 0zm0 22c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4 1 1.1-3.9-.3-.4C2 15.5 1.5 13.8 1.5 12 1.5 6.2 6.2 1.5 12 1.5S22.5 6.2 22.5 12 17.8 22 12 22z" />
            </svg>
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
