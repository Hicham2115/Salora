"use client"

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/AppSidebar"
import { DashboardLoading } from "@/components/DashboardLoading"
import { useUser } from "@clerk/nextjs"

function DashboardContent({ children }) {
  const { open } = useSidebar()

  return (
    <main className="flex-1 bg-background">
      {!open && (
        <div className="p-4">
          <SidebarTrigger className="cursor-pointer bg-primary p-4 text-primary-foreground hover:bg-primary hover:text-primary-foreground hover:opacity-80" />
        </div>
      )}

      {children}
    </main>
  )
}

export default function DashboardLayout({ children }) {
  const { isLoaded } = useUser()

  if (!isLoaded) return <DashboardLoading />

  return (
    <SidebarProvider>
      <AppSidebar />

      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
