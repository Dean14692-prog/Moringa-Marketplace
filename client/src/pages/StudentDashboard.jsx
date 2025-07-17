"use client";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../components/Sidebar";
import { sidebarLinks } from "../constants/sidebarLinks";
import { Outlet } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <Sidebar>
      <div className="flex">
        <SidebarBody>
          <div className="flex flex-col gap-2 mt-6 px-4">
            {sidebarLinks.map((link, index) => (
              <SidebarLink key={index} link={link} onClick={link.onClick} />
            ))}
          </div>
        </SidebarBody>

        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          {/* This is where nested routes will be rendered */}
          <Outlet />
        </main>
      </div>
    </Sidebar>
  );
};

export default StudentDashboard;
