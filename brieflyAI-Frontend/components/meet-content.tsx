"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import MorphPanel from "./ai-input";
import { motion } from "motion/react";
import { Sparkles, MapPin, Flag } from "lucide-react";

type Tab = "brief" | "checkpoints" | "flags";
type Severity = "high" | "medium" | "low";

interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
}

interface FlagItem {
  id: string;
  label: string;
  severity: Severity;
}

const mockData: {
  brief: string;
  checkpoints: { id: string; label: string }[];
  flags: FlagItem[];
} = {
  brief:`The meeting centered around aligning cross-functional teams on the Q2 product roadmap, with a strong emphasis on accelerating user growth and improving first-touch experiences. A key highlight of the discussion was the strategic prioritization of the new onboarding flow, which is now positioned as a critical initiative to be designed, developed, and shipped by the end of the month. This decision reflects a broader focus on optimizing user activation, reducing friction in the early user journey, and driving higher conversion rates from sign-up to meaningful engagement.

From a marketing perspective, the revamped onboarding experience is expected to play a pivotal role in shaping first impressions, reinforcing brand positioning, and enabling more personalized user interactions. The team discussed how this rollout can be supported with targeted campaigns, messaging alignment, and potential A/B testing strategies to maximize impact post-launch.`,
  checkpoints: [
    { id: "c1", label: "Onboarding flow finalized by April 30" },
    { id: "c2", label: "Design handoff completed to engineering" },
    { id: "c3", label: "Analytics dashboard moved to Q3 backlog" },
    { id: "c4", label: "Weekly syncs scheduled every Monday" },
  ],
  flags: [
    {
      id: "f1",
      label: "Deadline risk: onboarding flow tight timeline",
      severity: "high",
    },
    {
      id: "f2",
      label: "Missing owner for backend API task",
      severity: "medium",
    },
    {
      id: "f3",
      label: "No follow-up on design feedback",
      severity: "low",
    },
  ],
};

const severityConfig: Record<
  Severity,
  { label: string; color: string; bg: string; border: string }
> = {
  high: {
    label: "High",
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
  },
  medium: {
    label: "Medium",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    border: "border-yellow-200",
  },
  low: {
    label: "Low",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
};

const tabConfig = [
  { key: "brief", label: "AI Brief", icon: <Sparkles size={13} /> },
  { key: "checkpoints", label: "Checkpoints", icon: <MapPin size={13} /> },
  { key: "flags", label: "Flags", icon: <Flag size={13} /> },
];

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.from === "user";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div className={cn("flex items-center gap-2", isUser && "flex-row-reverse")}>
        <div
          className={cn(
            "size-6 rounded-full flex items-center justify-center text-[10px] font-semibold",
            isUser
              ? "bg-neutral-900 text-white"
              : "bg-gradient-to-br from-sky-400 to-amber-300 text-white"
          )}
        >
          {isUser ? "U" : <Sparkles size={10} />}
        </div>
        <span className="text-[11px] text-neutral-400 font-medium">
          {isUser ? "You" : "Briefly AI"}
        </span>
      </div>

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] shadow-sm",
          isUser
            ? "bg-neutral-900 text-white"
            : "bg-white border border-neutral-200 text-neutral-700"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

export function MeetContent() {
  const [activeTab, setActiveTab] = React.useState<Tab>("brief");
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [messages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      from: "assistant",
      content: "Hi! I've analyzed this meeting. Ask me anything about it.",
    },
  ]);

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleCheck = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fafaf9]">
      
      {/* Header */}
      <header className="flex items-center gap-5 border-b px-5 h-12 shrink-0 bg-white">
        <SidebarTrigger />
        <div className="w-px h-4 bg-neutral-200" />

        <nav className="flex gap-1">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5",
                activeTab === tab.key
                  ? "bg-neutral-100 text-black"
                  : "text-neutral-400 hover:text-black"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL */}
        <div className="flex-1 overflow-y-auto p-10 bg-gradient-to-b from-transparent to-neutral-50">
          
          {/* BRIEF */}
          {activeTab === "brief" && (
            <div className="max-w-2xl space-y-4">
              <h1 className="text-2xl font-semibold">Meeting Brief</h1>
              <p className="text-neutral-600 leading-relaxed">
                {mockData.brief}
              </p>
            </div>
          )}

          {/* CHECKPOINTS */}
          {activeTab === "checkpoints" && (
            <div className="max-w-xl space-y-2">
              {mockData.checkpoints.map((cp) => {
                const isChecked = !!checked[cp.id];

                return (
                  <motion.div
                    key={cp.id}
                    layout
                    onClick={() => toggleCheck(cp.id)}
                    className={cn(
                      "flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer transition-all",
                      isChecked
                        ? "bg-neutral-50"
                        : "hover:bg-neutral-100"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleCheck(cp.id)}
                    />

                    <span
                      className={cn(
                        "text-[14px] transition-all duration-200",
                        isChecked
                          ? "line-through text-neutral-400"
                          : "text-neutral-700"
                      )}
                    >
                      {cp.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* FLAGS */}
          {activeTab === "flags" && (
            <div className="max-w-xl space-y-3">
              {mockData.flags.map((flag) => {
                const cfg = severityConfig[flag.severity];

                return (
                  <motion.div
                    key={flag.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl border flex items-start gap-3 bg-white shadow-sm hover:shadow-md transition-all",
                      cfg.border
                    )}
                  >
                    <div className={cn("w-1.5 rounded-full", cfg.bg)} />

                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-[14px] text-neutral-700">
                        {flag.label}
                      </p>

                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                          cfg.bg,
                          cfg.color,
                          cfg.border
                        )}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT CHAT PANEL */}
        <div className="w-100 flex flex-col border-l bg-white">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t">
            <MorphPanel />
          </div>
        </div>
      </div>
    </div>
  );
}