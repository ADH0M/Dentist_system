"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LogOut,
  Settings,
  UserIcon,
  MailMinus,
  LucideUserRoundPen,
} from "lucide-react"; // Install: npm install lucide-react

// shadcn/ui imports
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AddAssistant from "@/pages/assistant/AddAssistant";
import { logoutAction } from "@/lib/actions/auth-action";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
} | null;

// Extract sidebar content into a reusable component
function SidebarContent({
  user,
  onClose,
}: {
  user: User;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Patient", href: "/admin/users", icon: "👥" }, // Fixed typo: Patiant → Patient
  ];

  const handleLinkClick = () => {
    // Close mobile sheet when a link is clicked
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-foreground">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="bg-primary w-10 h-10 rounded-lg text-secondary flex items-center justify-center font-bold text-xl">
            T
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/70">
            TaskFlow
          </span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-border">
        <div className="space-y-2">
          <div className="font-medium truncate flex items-center gap-1">
            <UserIcon size={16} className="text-primary" />
            <span>{user?.username || "User"}</span>
          </div>
          <div className="text-sm text-muted-foreground truncate flex items-center gap-1">
            <MailMinus size={16} className="text-primary" />
            {user?.email || "user@example.com"}
          </div>
          <div className="text-xs flex gap-1 items-center justify-center  bg-primary/10 text-primary px-2 py-1 rounded-full">
            <LucideUserRoundPen size={16} className="text-primary" />
            <span>{user?.role || "Guest"}</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      {user?.role === "admin" && (
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
              Admin
            </h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href + " " + item.name}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
              App
            </h3>
            <ul className="space-y-2">
              <li>
                <AddAssistant />
              </li>
            </ul>
          </div>
        </nav>
      )}

      {/* "User Navigation" */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto"></nav>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>TaskFlow v1.0</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-destructive cursor-pointer"
              onClick={async () => {
                await logoutAction();
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ user }: { user?: User }) {
  const safeUser = user || null;

  return (
    <>
      {/* Mobile: Hamburger Menu (visible only on small screens) */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 
      bg-sidebar border-b border-border"
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] sm:w-[320px] p-0 border-r"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent user={safeUser} onClose={() => {}} />
          </SheetContent>
        </Sheet>

        <span className="text-lg font-bold bg-clip-text text-transparent bg-primary">
          TaskFlow
        </span>

        {/* Placeholder for right-side mobile actions */}
        <div className="w-10" />
      </div>

      {/* Desktop: Persistent Sidebar (hidden on mobile) */}
      <aside
        className="hidden md:flex w-64 bg-sidebar border-r border-border text-foreground flex-col 
      sticky top-0 h-full"
      >
        <SidebarContent user={safeUser} />
      </aside>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-16" />
    </>
  );
}
