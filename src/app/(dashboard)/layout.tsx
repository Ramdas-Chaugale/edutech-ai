"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { BrainCircuit, LayoutDashboard, Library, LineChart, PlusCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/student" },
  { icon: PlusCircle, label: "Create Quiz", href: "/student/create" },
  { icon: Library, label: "My Quizzes", href: "/student/quizzes" },
  { icon: LineChart, label: "Analytics", href: "/student/analytics" },
  { icon: Settings, label: "Settings", href: "/student/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col fixed inset-y-0">
        <div className="p-6 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight font-outfit text-lg">EduTech AI</span>
        </div>

        <nav className="flex-grow px-4 space-y-1 mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                pathname === item.href
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-purple-400" : "text-gray-500 group-hover:text-gray-300")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[140px]">Account Settings</span>
              <span className="text-[10px] text-gray-500 capitalize">Student</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
