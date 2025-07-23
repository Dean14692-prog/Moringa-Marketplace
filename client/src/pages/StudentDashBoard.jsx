import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import UploadProject from "./UploadProject";
import {
  IconBrandTabler,
  IconSettings,
  IconBook,
  IconBell,
  IconSearch,
  IconCalendar,
  IconFileText,
  IconStar,
  IconChartBar,
  IconUsers,
  IconUpload,
} from "@tabler/icons-react";

export function StudentDashBoard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "A full-stack online shopping application with React and Node.js",
      src: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      link: "/projects/ecommerce",
    },
    {
      id: 2,
      title: "AI Chatbot",
      description: "Natural language processing chatbot for customer support",
      src: "https://katakenya.org/wp-content/uploads/2025/03/vecteezy_ai-generated-ai-circuit-board-technology-background_37348385-scaled-1.jpg",
      link: "/projects/chatbot",
    },
    {
      id: 3,
      title: "Health Tracker App",
      description: "Mobile application for tracking fitness and nutrition",
      src: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      link: "/projects/health-tracker",
    },
    {
      id: 4,
      title: "Smart Home Dashboard",
      description: "IoT control panel for managing smart home devices",
      src: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      link: "/projects/smart-home",
    },
  ]);

  const [activeLink, setActiveLink] = useState("Dashboard");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.warn("No authentication token found. Redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setUserName(data.username || data.name || "Student");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleProjectUpload = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveLink("Dashboard");
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Upload Projects",
      href: "/dashboard/upload-project",
      icon: <IconUpload className="h-5 w-5 shrink-0" />,
    },
    {
      label: "My Projects",
      href: "/my-projects",
      icon: <IconFileText className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Courses",
      href: "/courses",
      icon: <IconBook className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Grades",
      href: "/grades",
      icon: <IconStar className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: <IconChartBar className="h-5 w-5 shrink-0" />,
    },
  ];

  const renderComponent = () => {
    switch (activeLink) {
      case "Upload Projects":
        return <UploadProject onProjectUpload={handleProjectUpload} />;
      case "Dashboard":
      default:
        return <Dashboard projects={projects} userName={userName} />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 items-center justify-center">
        <div className="text-red-500 dark:text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <motion.div
        initial={{ width: open ? 240 : 72 }}
        animate={{ width: open ? 240 : 72 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed h-screen bg-white dark:bg-neutral-800 shadow-lg z-10",
          "flex flex-col border-r border-gray-200 dark:border-neutral-700"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-neutral-700">
          <div />
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M15 19l-7-7 7-7" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setActiveLink(link.label)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeLink === link.label
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-700",
                  !open && "justify-center"
                )}
              >
                <span className={cn(open ? "mr-3" : "mx-auto")}>
                  {React.cloneElement(link.icon, {
                    className: cn(
                      "h-5 w-5",
                      activeLink === link.label
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    ),
                  })}
                </span>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="h-9 w-9 rounded-full border-2 border-white dark:border-neutral-700"
                alt="User"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-neutral-700"></span>
            </div>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Student
                </p>
              </motion.div>
            )}
            {open && (
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <IconSettings className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 pb-10 transition-all duration-300",
          open ? "ml-[240px]" : "ml-[72px]"
        )}
      >
        {renderComponent()}
      </div>
    </div>
  );
}

const Dashboard = ({ projects, userName }) => {
  const notifications = [
    {
      id: 1,
      title: "New assignment posted",
      course: "Web Development",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Grade updated for Project 2",
      course: "Data Structures",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "Lecture rescheduled",
      course: "Machine Learning",
      time: "2 days ago",
      read: true,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Marines Stand-Up",
      time: "09:00 AM",
      course: "Web Development",
    },
    {
      id: 2,
      title: "Group Discussion",
      time: "11:00 AM",
      course: "Web Development",
    },
    {
      id: 3,
      title: "Marines Check-Out",
      time: "2:00 PM",
      course: "Web Development",
    },
  ];

  const stats = [
    { name: "Courses Enrolled", value: "12", change: "+2", trend: "up" },
    { name: "Assignments Due", value: "5", change: "-3", trend: "down" },
    { name: "Projects Submitted", value: "8", change: "+1", trend: "up" },
    { name: "Avg. Grade", value: "87%", change: "+2%", trend: "up" },
  ];

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your courses today
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm hover:bg-gray-100 dark:hover:bg-neutral-700 relative">
            <IconBell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-white">
                  Dive into innovation and gear up! 🔥
                </h2>
                <p className="mt-2 text-blue-100 max-w-lg">
                  Discover creative student projects that are making waves and
                  grab some exclusive merch while you're at it.
                </p>
                <div className="mt-4 flex space-x-3">
                  <Link to="/projects">
                    <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
                      Explore Projects
                    </button>
                  </Link>
                  <Link to="/shop">
                    <button className="px-4 py-2 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition">
                      Visit Merch Shop
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Projects */}
          <div className="h-125 bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Projects
              </h2>
              <Link
                to="/my-projects"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View All
              </Link>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-neutral-700">
              {/* Project list would go here */}
            </ul>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Mark all as read
              </button>
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${
                    notification.read
                      ? "bg-white dark:bg-neutral-800"
                      : "bg-blue-50 dark:bg-blue-900/20"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 h-2 w-2 mt-1.5 rounded-full ${
                        notification.read
                          ? "bg-gray-300 dark:bg-neutral-600"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.course} • {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Events
              </h2>
              <a
                href="https://calendar.google.com/calendar/u/0/r"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View calendar
              </a>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <IconCalendar className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {event.time}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {event.course}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Groups */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Study Groups
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                    <IconUsers className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Web Dev Study Group
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Next meeting: Tomorrow, 4 PM
                  </p>
                </div>
                <button className="px-3 py-1 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                  Join
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    <IconUsers className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    ML Study Group
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Next meeting: Friday, 2 PM
                  </p>
                </div>
                <button className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
