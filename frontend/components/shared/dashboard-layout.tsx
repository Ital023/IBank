"use client";

import React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  LayoutDashboard,
  ArrowDownToLine,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/use-wallet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Statements", icon: LayoutDashboard },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownToLine },
  { href: "/dashboard/transfer", label: "Transfer", icon: ArrowRightLeft },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {wallet, setWallet, logout} = useWallet();

  useEffect(() => {
    if (!wallet) {
      router.push("/");
    }
  }, [wallet, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!wallet) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Landmark className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              QuickBank
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {wallet.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <nav className="border-b border-border/50 px-4">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 shrink-0",
                    isActive && "bg-secondary text-secondary-foreground",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
