import {
  IconHome,
  IconFolder,
  IconUser,
  IconLogout,
  IconUpload,
} from "@tabler/icons-react";

export const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconHome size={18} />,
  },
  {
    label: "My Projects",
    href: "/dashboard/projects",
    icon: <IconFolder size={18} />,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: <IconUser size={18} />,
  },
  {
    label: "Upload",
    href: "/dashboard/upload",
    icon: <IconUpload size={18} />,
  },
  {
    label: "Logout",
    href: "#",
    icon: <IconLogout size={18} />,
    onClick: () => {
      // Replace with your actual logout logic
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
  },
];
