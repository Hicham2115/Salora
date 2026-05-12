# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Salora is a SaaS salon management and booking web application. It includes a marketing landing page and an authenticated dashboard for salon owners. The app is currently in early development (v0.0.1) with mock data — no backend or database is wired up yet.

## Development Commands

All commands run from `FrontEnd/`:

```bash
npm run dev        # Start dev server with Turbopack (fast HMR)
npm run build      # Production build
npm start          # Start production server
npm run lint       # ESLint
npm run format     # Prettier (auto-sorts Tailwind classes)
npm run typecheck  # TypeScript type check (tsc --noEmit)
```

## Architecture

### Directory Layout

```
FrontEnd/
├── app/
│   ├── layout.tsx                        # Root layout — wraps with ClerkProvider
│   ├── globals.css                       # Tailwind theme variables, brand colors
│   ├── page.tsx                          # Landing/marketing page
│   ├── assets/                           # Static assets (e.g. noimage.png)
│   ├── sign-up/[[...sign-up]]/page.tsx   # Clerk sign-up route
│   └── dashboard/
│       ├── layout.tsx                    # Dashboard shell (SidebarProvider + AppSidebar)
│       ├── page.tsx                      # Redirects to /dashboard/overview
│       ├── overview/page.tsx             # Main dashboard view (mock data lives here)
│       ├── bookings/page.tsx             # Bookings management
│       ├── services/page.tsx             # Services CRUD
│       ├── clients/page.tsx              # Client list
│       ├── reviews/page.tsx              # Reviews view
│       ├── portfolio/page.tsx            # Photo portfolio grid (upload, edit, delete)
│       └── settings/page.tsx            # Settings (Salon Profile, Opening Hours, Staff, Notifications)
├── components/
│   ├── AppSidebar.tsx                    # Nav sidebar — links to all dashboard routes + Settings
│   ├── SmoothScroll.tsx                  # Lenis smooth scroll wrapper
│   ├── MainSection/                      # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── TheProblem.tsx
│   │   ├── WhySalora.tsx
│   │   ├── Pricing.tsx
│   │   ├── Reviews.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   └── SaloraDashboardPreview.tsx
│   └── ui/                               # shadcn/ui primitives — never hand-edit
├── hooks/
│   └── use-mobile.ts                     # useIsMobile() for responsive logic
├── lib/
│   └── utils.ts                          # cn() utility (clsx + tailwind-merge)
├── proxy.ts                              # Clerk middleware (auth gating)
└── next.config.mjs                       # Remote image domains (img.clerk.com)
```

### Dashboard Routes

| Route | Page |
|---|---|
| `/dashboard/overview` | Stats, calendar, upcoming appointments |
| `/dashboard/bookings` | Booking list and management |
| `/dashboard/services` | Service CRUD grouped by category |
| `/dashboard/clients` | Client directory |
| `/dashboard/reviews` | Client reviews |
| `/dashboard/portfolio` | Photo portfolio grid with upload/edit/delete |
| `/dashboard/settings` | Salon Profile · Opening Hours · Staff · Notifications |

### Key Patterns

**Authentication:** Clerk handles all auth via middleware in `proxy.ts`. Use `useUser()` in client components to access session data. The root `layout.tsx` wraps the app in `<ClerkProvider>`.

**UI Components:** Uses shadcn/ui (Radix Nova style). Add new components via `npx shadcn@latest add <component>` — never hand-edit files in `components/ui/`. Use the `cn()` helper from `lib/utils.ts` for merging Tailwind classes.

**Styling:** Tailwind CSS v4 with PostCSS (no `tailwind.config.js`). Theme variables (colors, radii, spacing) are defined in `app/globals.css`. Primary brand color is `#1b4331` (dark green). Background color for dashboard pages is `#f2ede6` (warm off-white). Run `npm run format` to auto-sort class order.

**Client vs Server components:** Root layout and static landing sections are server components. All dashboard pages use `"use client"` for interactivity (state, hooks, Clerk user data).

**Mock data:** All dashboard data is currently hardcoded in each page file. When the backend is integrated, replace these with API calls.

**Sidebar:** `AppSidebar.tsx` uses the shadcn `Sidebar` primitives. Nav items use `usePathname()` for active state styling. Settings is a standalone `<Link>` at the bottom of the sidebar (not part of the main items array).

### TypeScript

- Strict mode enabled; path alias `@/*` maps to the project root (`FrontEnd/`)
- Target ES2017, module resolution: bundler
- Run `npm run typecheck` before committing — the build may succeed even with type errors due to Next.js defaults

### Image Optimization

Remote images from `img.clerk.com` are allowed in `next.config.mjs`. Add other remote domains there as needed.

## Naming

The product is called **Salora**. Never use "SalonFlow" — replace any occurrence automatically without asking.
