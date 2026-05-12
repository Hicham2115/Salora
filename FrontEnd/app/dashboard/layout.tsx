"use client"

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/AppSidebar"
import { DashboardLoading } from "@/components/DashboardLoading"
import { useUser } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


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
  const queryClient = new QueryClient()

  if (!isLoaded) return <DashboardLoading />

  return (
    <SidebarProvider>
      <AppSidebar />

      <DashboardContent>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </DashboardContent>
    </SidebarProvider>
  )
}
