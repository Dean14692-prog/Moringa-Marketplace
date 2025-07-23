import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const PROJECTS_PER_PAGE = 8; // Define how many projects per page

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionInput, setRejectionInput] = useState({
    show: false,
    id: null,
    reason: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // New state for current page

  useEffect(() => {
    fetch("http://127.0.0.1:3001/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch projects");
        setLoading(false);
      });
  }, []);

  const handleApprove = (projectId) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, status: "approved", reviewReason: "" } : p
    );
    setProjects(updated);
    toast.success("Project approved successfully!");
  };

  const handleRejectPrompt = (projectId) => {
    setRejectionInput({ show: true, id: projectId, reason: "" });
  };

  const submitRejection = () => {
    const { id, reason } = rejectionInput;
    if (!reason.trim()) {
      return toast.warning("Please enter a rejection reason.");
    }
    const updated = projects.map((p) =>
      p.id === id ? { ...p, status: "rejected", reviewReason: reason } : p
    );
    setProjects(updated);
    setRejectionInput({ show: false, id: null, reason: "" });
    toast.success("Project rejected successfully!");
  };

  // Filter projects based on search term and active tab
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return !project.status && matchesSearch;
    if (activeTab === "approved")
      return project.status === "approved" && matchesSearch;
    if (activeTab === "rejected")
      return project.status === "rejected" && matchesSearch;

    return true;
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  // Get projects for the current page
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-gray-800 shadow-lg p-4 flex flex-col items-center sticky top-0 h-screen border-r border-gray-700"
      >
        <div className="mb-10 mt-4 flex justify-between items-center w-full px-2">
          {isSidebarOpen && (
            <Link
              to="/"
              className="text-2xl font-extrabold text-blue-400 whitespace-nowrap overflow-hidden"
            >
              DevHub Admin
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 9l3 3m0 0l-3 3m3-3H6m6 10a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              )}
            </svg>
          </button>
        </div>
        <nav className="space-y-4 w-full">
          {/* Using NavLink for active styling */}
          <NavLink
            to="/admin-dashboard" // Example path, adjust as needed
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
              } ${!isSidebarOpen && "justify-center"}`
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-7-7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap overflow-hidden">
                Dashboard
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admin-projects" // Example path, adjust as needed
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
              } ${!isSidebarOpen && "justify-center"}`
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-1.208-8.455-3.245M4.106 5.35A18.94 18.94 0 0112 3c2.392 0 4.743.766 6.697 2.228m-.258 5.922L21 13.255M4.106 5.35L3 6.068m18 0l-1.106-.718M12 9v6m-4.5 3h9M8.25 10.5L12 14.25 15.75 10.5"
              ></path>
            </svg>
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap overflow-hidden">
                Projects
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admin-users" // Example path, adjust as needed
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
              } ${!isSidebarOpen && "justify-center"}`
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M5 20h2a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm12-7l-4-4m0 0l-4 4m4-4v12"
              ></path>
            </svg>
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap overflow-hidden">
                Users
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admin-settings" // Example path, adjust as needed
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
              } ${!isSidebarOpen && "justify-center"}`
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.53-.32 1.139-.757 1.724-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap overflow-hidden">
                Settings
              </span>
            )}
          </NavLink>
        </nav>
        <div className="mt-auto pt-6 w-full">
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-colors duration-200 w-full ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap overflow-hidden">
                Logout
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col transition-all duration-300 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full flex-grow">
          {/* Header and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Project Dashboard
              </h1>
              <p className="text-gray-400">
                Manage and review submitted projects
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <Link
                to="/upload-project"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload Project
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium relative ${
                  activeTab === tab
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1); // Reset to first page on tab change
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                    layoutId="underline"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Projects
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {projects.length}
                  </p>
                </div>
                <div className="bg-blue-700/30 p-3 rounded-full">
                  <svg
                    className="w-7 h-7 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 hover:border-amber-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Pending Review
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {projects.filter((p) => !p.status).length}
                  </p>
                </div>
                <div className="bg-amber-700/30 p-3 rounded-full">
                  <svg
                    className="w-7 h-7 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 hover:border-green-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-400">Approved</p>
                  <p className="text-3xl font-bold text-white">
                    {projects.filter((p) => p.status === "approved").length}
                  </p>
                </div>
                <div className="bg-green-700/30 p-3 rounded-full">
                  <svg
                    className="w-7 h-7 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 hover:border-red-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-400">Rejected</p>
                  <p className="text-3xl font-bold text-white">
                    {projects.filter((p) => p.status === "rejected").length}
                  </p>
                </div>
                <div className="bg-red-700/30 p-3 rounded-full">
                  <svg
                    className="w-7 h-7 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : paginatedProjects.length === 0 ? ( // Use paginatedProjects here
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-center border border-gray-700">
              <svg
                className="mx-auto h-12 w-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-white">
                No projects found
              </h3>
              <p className="mt-1 text-gray-400">
                {activeTab === "all"
                  ? "No projects have been submitted yet."
                  : `No ${activeTab} projects found.`}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProjects.map(
                  (
                    project // Use paginatedProjects here
                  ) => (
                    <motion.div
                      key={project.id}
                      className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 hover:shadow-2xl hover:border-blue-600 transition-all duration-300 flex flex-col group relative"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Image Section */}
                      <div
                        className="relative h-48 bg-gray-700 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(project.imageUrl)}
                      >
                        {project.imageUrl ? (
                          <img
                            src={`http://127.0.0.1:3001/${project.imageUrl}`}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/600x400/374151/D1D5DB?text=Image+Not+Found";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              !project.status
                                ? "bg-amber-500 text-white"
                                : project.status === "approved"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {!project.status
                              ? "Pending"
                              : project.status.charAt(0).toUpperCase() +
                                project.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-xl font-bold text-white line-clamp-1">
                            {project.title}
                          </h2>
                          {project.forSale && (
                            <span className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ml-2">
                              Ksh {project.price}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-grow">
                          {project.description}
                        </p>

                        {/* Links */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors font-medium text-gray-200"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            GitHub
                          </a>
                          {project.demoLink && (
                            <a
                              href={project.demoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-md transition-colors font-medium text-white"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                              </svg>
                              Live Demo
                            </a>
                          )}
                        </div>

                        {/* Review reason if exists */}
                        {project.reviewReason && (
                          <div className="bg-gray-700 p-3 rounded-lg mt-auto border border-gray-600">
                            <p className="text-xs font-medium text-gray-400 mb-1">
                              Review Note:
                            </p>
                            <p className="text-xs text-gray-200 line-clamp-2">
                              {project.reviewReason}
                            </p>
                          </div>
                        )}

                        {/* Approve/Reject buttons */}
                        {!project.status && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleApprove(project.id)}
                              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg transition-colors font-semibold shadow-md"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectPrompt(project.id)}
                              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg transition-colors font-semibold shadow-md"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* Rejection Reason Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)} // Close on background click
            >
              <motion.img
                src={`http://127.0.0.1:3001/${selectedImage}`}
                alt="Full screen project image"
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          )}
          {rejectionInput.show && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl border border-gray-700 text-gray-100"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">
                    Reject Project
                  </h3>
                  <button
                    onClick={() =>
                      setRejectionInput({ show: false, id: null, reason: "" })
                    }
                    className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Please provide a reason for rejecting this project. This
                  feedback will be visible to the submitter.
                </p>
                <textarea
                  rows={4}
                  placeholder="Enter detailed reason for rejection..."
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-4"
                  value={rejectionInput.reason}
                  onChange={(e) =>
                    setRejectionInput((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                ></textarea>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setRejectionInput({ show: false, id: null, reason: "" })
                    }
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRejection}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    Submit Rejection
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)} // Close on background click
            >
              <motion.img
                src={`http://127.0.0.1:3001/${selectedImage}`}
                alt="Full screen project image"
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
