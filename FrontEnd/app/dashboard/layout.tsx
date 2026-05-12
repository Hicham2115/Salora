"use client"

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/AppSidebar"
import { useUser } from "@clerk/nextjs"

function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar skeleton */}
      <div className="flex w-64 shrink-0 flex-col gap-6 border-r bg-white px-5 py-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="h-px bg-muted" />

        {/* User card */}
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
          <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-11 animate-pulse rounded-xl bg-muted"
              style={{ opacity: 1 - i * 0.08 }}
            />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 bg-[#f5f4f0] p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-7 w-56 animate-pulse rounded bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="mb-1 h-8 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Calendar + appointments */}
        <div className="grid grid-cols-[1fr_360px] gap-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3.5 w-44 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex gap-1">
                <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()

  return (
    <main className="flex-1 bg-[#f2ede6]">
      {!open && (
        <div className="p-4">
          <SidebarTrigger className="cursor-pointer bg-primary p-4 text-white hover:bg-primary hover:text-white hover:opacity-80" />
        </div>
      )}

      {children}
    </main>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded } = useUser()

  if (!isLoaded) return <DashboardSkeleton />

  return (
    <SidebarProvider>
      <AppSidebar />

      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
