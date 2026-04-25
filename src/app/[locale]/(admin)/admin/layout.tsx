"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Wrench,
  Settings,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/uses", label: "Uses / Tools", icon: Wrench },
  { href: "/admin/about", label: "About / CV", icon: User },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--color-bg-primary)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[260px] bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col transition-transform duration-300",
          "md:translate-x-0 md:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-border)]">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2"
          >
            <span className="text-[17px] font-bold tracking-[-0.02em]">
              <span className="text-[var(--color-text-primary)]">im</span>
              <span className="text-[var(--color-accent)]">.</span>
              <span className="text-[var(--color-text-primary)]">dev</span>
            </span>
            <span className="text-[12px] font-medium text-[var(--color-text-tertiary)] bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded">admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-tertiary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-[15px] font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                )}
              >
                <link.icon className="w-[18px] h-[18px]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[var(--color-border)] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[13px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            View site &rarr;
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[13px] text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 border-b border-[var(--color-border)] flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-tertiary)]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
