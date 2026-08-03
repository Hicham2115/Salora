"use client"

import { SignUp } from "@clerk/nextjs"
import { CalendarDays, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* ── Left panel ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-[#0a0a0a] p-12 text-white lg:flex">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-[480px] w-[480px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-[340px] w-[340px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-8 bottom-8 h-[200px] w-[200px] rounded-full border border-white/10" />

        <div className="relative z-10 flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Salora
              </span>
            </Link>
          </div>

          {/* Notification card */}
          <div className="flex items-start gap-3 rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <CalendarDays className="h-5 w-5 text-white/80" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                3 new bookings today
              </p>
              <p className="mt-0.5 text-xs text-white/70">
                Hamza, Karim &amp; Omar booked online while you were busy.
              </p>
            </div>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-4">
            <h1 className="font-jakarta text-5xl leading-[1.1] font-bold tracking-tight text-white">
              Your salon,
              <br />
              running on autopilot
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-white/70">
              Join 300+ Moroccan salons managing bookings, clients, and payments
              — all from one dashboard.
            </p>
          </div>

          {/* Bullet points */}
          <ul className="flex flex-col gap-3">
            {[
              "14-day free trial, no card needed",
              "Setup in under 5 minutes",
              "Cancel anytime, no questions asked",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-white/90"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-white/80 italic">
            &quot;I set it up on a Tuesday evening. By Wednesday morning I had 2
            online bookings.&quot;
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b7355] text-xs font-bold text-white">
              YB
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Youssef Benali</p>
              <p className="text-xs text-white/60">
                Barber Studio · Casablanca
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 lg:w-1/2">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#d4a954",
              colorBackground: "#0a0a0a",
              colorInputBackground: "#1a1a1a",
              colorText: "#ffffff",
              colorTextSecondary: "#c9c9c9",
              borderRadius: "0.625rem",
              fontFamily: "inherit",
            },
            elements: {
              rootBox: "w-full max-w-md",
              card: "shadow-none bg-transparent p-0 gap-6",
              cardBox: "shadow-none",
              headerTitle: "text-3xl! font-bold text-white! font-jakarta",
              headerSubtitle: "text-sm text-white/70! mt-1",
              socialButtonsBlockButton:
                "bg-[#1a1a1a]! border border-white/10 text-white! hover:bg-[#1f1f1f]! rounded-xl h-11 font-medium shadow-none",
              socialButtonsBlockButtonText: "font-medium text-sm text-white!",
              dividerLine: "bg-white/10!",
              dividerText: "text-white/60! text-xs",
              formFieldLabel: "text-sm font-medium text-white!",
              formFieldInput:
                "bg-[#1a1a1a]! border-white/10 text-white! rounded-xl h-11 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary",
              formButtonPrimary:
                "bg-primary! text-primary-foreground! hover:bg-primary/90! rounded-xl h-11 font-semibold text-sm shadow-none",
              footerActionText: "text-white/70! text-sm",
              footerActionLink: "text-primary! font-semibold hover:underline",
              identityPreviewText: "text-sm text-white/90!",
              identityPreviewEditButton: "text-primary!",
              formFieldInputShowPasswordButton:
                "text-white/60! hover:text-white!",
              otpCodeFieldInput: "border-white/10 bg-[#1a1a1a]! text-white! rounded-lg",
            },
          }}
        />
      </div>
    </div>
  )
}
