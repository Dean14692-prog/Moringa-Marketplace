"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function StudentDashBoard() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      
      label: "My Projects",
      href: "/my-projects",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex w-screen flex-1 overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Dennis Ngui",
                href: "#",
                icon: (
                  <img
                    src=""
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Student DashBoard
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Dashboard content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-6 px-4 md:px-8 pt-4 pb-10 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        {/* Welcome section */}
        <div className="w-full">
          <div className="flex w-full flex-col md:flex-row gap-6 rounded-lg bg-[#ADDFFF] p-6 md:items-center">
            {/* Left Side: Text */}
            <div className="w-full">
              <h2 className="text-blue-700 font-bold text-lg md:text-xl mb-2">
                Welcome back Elvis Onyii, your dashboard is ready!
              </h2>
              <p className="text-sm md:text-base text-gray-700 font-medium mb-4">
                Welcome to your dashboard. You can view messages, track project
                statistics,
                <br />
                manage your uploaded projects, and stay updated on marketplace
                activity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition">
                    E-commerce
                  </button>
                </Link>

                <Link to="/projects">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition">
                    Projects List
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side Placeholder */}
            <div className="md:w-1/3 h-32 bg-white rounded-lg shadow-sm hidden md:block">
              {/* You can place an image or stats here */}
            </div>
          </div>
        </div>

        {/* Student Cards */}
        <div className="flex gap-2 w-full flex-wrap justify-between">
          <div className="w-full md:w-[24%] h-60 animate-pulse rounded-lg bg-white text-green-700 p-4 font-bold">
            Ken Tuei
          </div>
          <div className="w-full md:w-[24%] h-60 animate-pulse rounded-lg bg-white text-purple-800 p-4 font-bold">
            Dennis Ngui
          </div>
          <div className="w-full md:w-[24%] h-60 animate-pulse rounded-lg bg-white text-orange-400 p-4 font-bold">
            Rose Momanyi
          </div>
          <div className="w-full md:w-[24%] h-60 animate-pulse rounded-lg bg-white text-blue-600 p-4 font-bold">
            Aaron Rashid
          </div>
        </div>
      </div>
    </div>
  );
};
