"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onSelectMeet?: (title: string) => void
}

export function AppSidebar({ onSelectMeet, ...props }: AppSidebarProps) {
  const [email, setEmail] = React.useState("Profile")

  React.useEffect(() => {
    const stored = localStorage.getItem("email")
    if (stored) setEmail(stored)
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="pt-6">
        <NavUser user={{
          name: email,
          avatar: "/avatars/shadcn.jpg"
        }} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[]} onSelectMeet={onSelectMeet} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}