"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  User,
  MessageSquare,
  FileText,
  Map,
  Lightbulb,
  BarChart3,
  Compass
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/projects", label: "Projects", icon: Lightbulb },
    { href: "/skill-gap", label: "Skill Gap", icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                CareerPilot AI
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
