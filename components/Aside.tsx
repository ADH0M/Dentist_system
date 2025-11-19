"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const user = { name: "adham", email: "adham.mail.com" };
export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Add Task", href: "/add-task", icon: "➕" },
    { name: "Tasks", href: "/", icon: "📋" },
  ];

  return (
    <aside className="w-64 bg-linear-to-br from-gray-800 to-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
            T
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-cyan-400">
            TaskFlow
          </span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-700">
        <div className="space-y-2">
          <p className="font-medium truncate">{user?.name || "User"}</p>
          <p className="text-sm text-gray-400 truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Optional: Footer with logout/settings */}
      <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-500">
        TaskFlow v1.0
      </div>
    </aside>
  );
}
