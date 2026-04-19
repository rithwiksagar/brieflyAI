"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CirclePlusIcon, FolderOpenIcon, MoreHorizontalIcon, ShareIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

const pastMeets = [
  { id: 1, title: "Product Roadmap Discussion" },
  { id: 2, title: "Weekly Team Standup" },
  { id: 3, title: "Client Onboarding Call" },
  { id: 4, title: "Design Review Session" },
  { id: 5, title: "Q2 Planning Meeting" },
]

export function NavMain({
  items,
  onSelectMeet,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
  onSelectMeet?: (title: string) => void
}) {
  const [title, setTitle] = React.useState("")
  const [meetingUrl, setMeetingUrl] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

async function handleJoin(e: React.FormEvent) {
  e.preventDefault()

  if (!title || !meetingUrl) {
    toast.error("Please fill in both fields")
    return
  }

  const userId = localStorage.getItem("email")
  if (!userId) {
    toast.error("You must be logged in")
    return
  }

  setLoading(true)
  try {
    const res = await fetch("https://backend-meet-ena8.onrender.com/api/startBot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, meetingUrl, userId }),
    })

    console.log("Status:", res.status)

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.message || "Failed to join meeting")
      return
    }

    toast.success("Successfully joined the meet")
    setTitle("")
    setMeetingUrl("")
    setOpen(false)
  } catch (err) {
    console.error("Fetch error:", err)
    toast.error("Network error. Please try again.")
  } finally {
    setLoading(false)
  }
}


  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="New Meet"
                  className="min-w-8 h-10 text-base bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                >
                  <CirclePlusIcon className="size-5" />
                  <span>New Meet</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
                <form onSubmit={handleJoin}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Join Meeting</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-5 py-6">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="meet-title" className="text-sm font-medium">Title</Label>
                      <Input
                        id="meet-title"
                        placeholder="Enter meeting title"
                        className="h-12 rounded-lg px-4 text-base"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="meet-link" className="text-sm font-medium">Meeting Link</Label>
                      <Input
                        id="meet-link"
                        placeholder="Paste meeting link"
                        className="h-12 rounded-lg px-4 text-base"
                        value={meetingUrl}
                        onChange={(e) => setMeetingUrl(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="rounded-lg" type="button">Cancel</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="rounded-lg"
                      disabled={loading}
                    >
                      {loading ? "Joining..." : "Join"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarGroupLabel>Past Meets</SidebarGroupLabel>
          {pastMeets.map((meet) => (
            <SidebarMenuItem key={meet.id}>
              <SidebarMenuButton
                tooltip={meet.title}
                onClick={() => onSelectMeet?.(meet.title)}
                data-active={false}
                className="hover:bg-transparent focus:bg-transparent active:bg-transparent data-[active=true]:bg-transparent"
              >
                <span className="truncate">{meet.title}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontalIcon />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem>
                    <FolderOpenIcon className="mr-2 size-4" />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShareIcon className="mr-2 size-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <TrashIcon className="mr-2 size-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}