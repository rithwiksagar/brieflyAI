"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useState } from "react"
import { MeetContent } from "@/components/meet-content"

export default function Page() {
  const [selectedMeet, setSelectedMeet] = useState<string | null>(null)

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" onSelectMeet={setSelectedMeet} />
        <SidebarInset className="flex flex-col min-h-0 overflow-hidden">
          {selectedMeet ? (
            <MeetContent />
          ) : (
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-amber-50 -z-10" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-40 -z-10" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-40 -z-10" />
              <p className="text-neutral-400 text-sm font-medium">There Are No Current Meeting Going On...</p>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}