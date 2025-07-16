import React from "react";
import { HiOutlineViewGrid, HiOutlineClipboardCheck, HiOutlineShoppingBag, HiOutlineChartBar, HiOutlineUserCircle } from "react-icons/hi";

const navItems = [
  { label: "Dashboard", key: "dashboard", icon: <HiOutlineViewGrid size={22} /> },
  { label: "Project Moderation", key: "projects", icon: <HiOutlineClipboardCheck size={22} /> },
  { label: "Merchandise Manager", key: "merch", icon: <HiOutlineShoppingBag size={22} /> },
  { label: "Analytics", key: "analytics", icon: <HiOutlineChartBar size={22} /> },
];

export default function AdminSidebar({ active, setActive, sidebarOpen, setSidebarOpen, admin }) {
  return (
    <aside
      className={`fixed z-30 inset-y-0 left-0 w-64 bg-[#0D1B2A] text-[#deeaee] flex flex-col transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 md:static md:inset-auto`}
      aria-label="Sidebar"
    >
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#1C2541]">
        <HiOutlineUserCircle size={32} className="text-[#deeaee]" />
        <div>
          <div className="font-semibold">{admin?.name || "Admin User"}</div>
          <div className="text-xs text-[#e0e1dd]">Administrator</div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition font-medium gap-3 text-left ${
              active === item.key
                ? "bg-[#1C2541] text-[#deeaee] shadow"
                : "hover:bg-[#1C2541] hover:text-[#deeaee]"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto py-4 px-6 text-xs text-[#e0e1dd] border-t border-[#1C2541]">
        Moringa Admin
      </div>
    </aside>
  );
}
