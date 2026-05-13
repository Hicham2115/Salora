"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SalonProfileTab } from "./_components/SalonProfileTab"
import { OpeningHoursTab } from "./_components/OpeningHoursTab"
import { StaffTab } from "./_components/StaffTab"
import { NotificationsTab } from "./_components/NotificationsTab"

type Tab = "profile" | "hours" | "staff" | "notifications"

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors",
        active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {children}
    </button>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile")

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your salon profile and preferences
        </p>
      </div>

      <div className="flex gap-6">
        <nav className="flex w-48 shrink-0 flex-col gap-1">
          <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>
            Salon Profile
          </TabButton>
          <TabButton active={tab === "hours"} onClick={() => setTab("hours")}>
            Opening Hours
          </TabButton>
          <TabButton active={tab === "staff"} onClick={() => setTab("staff")}>
            Staff
          </TabButton>
          <TabButton active={tab === "notifications"} onClick={() => setTab("notifications")}>
            Notifications
          </TabButton>
        </nav>

        <div className="flex-1 rounded-2xl bg-white p-8 shadow-sm">
          {tab === "profile" && <SalonProfileTab />}
          {tab === "hours" && <OpeningHoursTab />}
          {tab === "staff" && <StaffTab />}
          {tab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  )
}
