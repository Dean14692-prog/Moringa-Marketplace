import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation, useNavigate for redirection
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Home, // Assuming you want a home icon
  ShoppingCart, // Assuming you want an e-commerce icon
  Code, // Assuming you want a project view icon
  LogOut, // For a logout button
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [allProjects, setAllProjects] = useState([]); // Store all fetched projects
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState(""); // State for rejection reason

  // Define your API base URL
  const API_BASE_URL = "http://127.0.0.1:5555"; // Your Flask backend URL

  const categories = [
    "all",
    "Web Development",
    "Mobile Development",
    "Blockchain",
    "IoT",
    "AI/ML",
  ];

  // Helper to filter projects based on their approval status
  // A project is 'pending' if it's not approved AND doesn't have a rejection reason.
  // A project is 'rejected' if it's not approved AND has a rejection reason.
  const getFilteredProjects = (status, category) => {
    return allProjects.filter((project) => {
      const matchesStatus =
        status === "pending"
          ? !project.isApproved && !project.review_reason
          : status === "approved"
          ? project.isApproved
          : status === "rejected"
          ? !project.isApproved && project.review_reason
          : true; // For "all" if we ever use it (e.g., in a combined view)

      const matchesCategory =
        category === "all" || project.category === category;

      return matchesStatus && matchesCategory;
    });
  };

  // Effect to fetch all projects for admin
  useEffect(() => {
    const fetchAllProjects = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token"); // Use 'access_token' as per your app.py JWT setup
        if (!token) {
          console.warn("No authentication token found. Redirecting to login.");
          navigate("/login"); // Redirect to login if no token
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            // Handle unauthorized/forbidden
            console.error(
              "Authentication failed or not authorized as admin. Redirecting."
            );
            localStorage.removeItem("access_token"); // Clear invalid token
            localStorage.removeItem("refresh_token");
            navigate("/login"); // Redirect to login
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setAllProjects(data); // Store all projects
      } catch (error) {
        console.error("Error fetching all projects:", error);
        // Display user-friendly error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProjects();
  }, [navigate]); // Add navigate to dependency array

  // Derived states for easier access to filtered lists (used for counts)
  // These are always based on 'all' category for the overall counts
  const pendingProjects = getFilteredProjects("pending", "all");
  const approvedProjects = getFilteredProjects("approved", "all");
  const rejectedProjects = getFilteredProjects("rejected", "all");

  const handleApprove = async (projectId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${API_BASE_URL}/api/admin/projects/${projectId}`, // Correct endpoint
        {
          method: "PATCH", // Correct method
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: true, review_reason: null }), // Correct payload, clear reason on approve
        }
      );

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
          return;
        }
        const errorData = await res.json();
        throw new Error(
          `Failed to approve project: ${errorData.msg || res.statusText}`
        );
      }

      const updatedProject = await res.json();
      // Update the project in the allProjects state
      setAllProjects((prev) =>
        prev.map((proj) => (proj.id === projectId ? updatedProject : proj))
      );
      setSelectedMessage(null); // Clear selected message after action
      showNotification(`Project "${updatedProject.title}" approved!`);
    } catch (error) {
      console.error("Error approving project:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (projectId) => {
    if (!rejectionReasonInput.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${API_BASE_URL}/api/admin/projects/${projectId}`, // Correct endpoint
        {
          method: "PATCH", // Correct method
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isApproved: false, // Set to false for rejection
            review_reason: rejectionReasonInput.trim(), // Send the rejection reason
          }),
        }
      );

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
          return;
        }
        const errorData = await res.json();
        throw new Error(
          `Failed to reject project: ${errorData.msg || res.statusText}`
        );
      }

      const rejectedProject = await res.json();
      // Update the project in the allProjects state
      setAllProjects((prev) =>
        prev.map((proj) => (proj.id === projectId ? rejectedProject : proj))
      );
      setSelectedMessage(null); // Clear selected message after action
      setRejectionReasonInput(""); // Clear rejection reason input
      showNotification(`Project "${rejectedProject.title}" rejected.`);
    } catch (error) {
      console.error("Error rejecting project:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login"); // Redirect to login page after logout
  };

  const showNotification = (message) => {
    // Create a temporary notification element
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  // Projects to display in the current active tab, filtered by category
  const currentTabProjects = getFilteredProjects(activeTab, filterCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {" "}
      {/* Changed background and default text color, added font-sans */}
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        {" "}
        {/* Darker header */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Manage student project submissions
            </p>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/ecommerce"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>E-commerce</span>
            </Link>
            <Link
              to="/projects"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center space-x-2"
            >
              <Code className="w-5 h-5" />
              <span>Project View</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats at the Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 text-center">
            <p className="text-gray-400 text-sm">Total Submissions</p>
            <p className="text-3xl font-bold text-white mt-2">
              {allProjects.length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 text-center">
            <p className="text-gray-400 text-sm">Pending Review</p>
            <p className="text-3xl font-bold text-amber-400 mt-2">
              {pendingProjects.length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 text-center">
            <p className="text-gray-400 text-sm">Approval Rate</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {approvedProjects.length + rejectedProjects.length > 0
                ? Math.round(
                    (approvedProjects.length /
                      (approvedProjects.length + rejectedProjects.length)) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg w-fit">
            {" "}
            {/* Darker tab background */}
            {["pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedMessage(null); // Clear selected message when changing tabs
                  setRejectionReasonInput(""); // Clear rejection reason input
                }}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab
                    ? "bg-gray-900 text-blue-400 shadow-lg" // Darker active tab, blue text
                    : "text-gray-300 hover:text-white hover:bg-gray-600" // Lighter inactive tab text, hover effects
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "pending" && ` (${pendingProjects.length})`}
                {tab === "approved" && ` (${approvedProjects.length})`}
                {tab === "rejected" && ` (${rejectedProjects.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />{" "}
            {/* Filter icon color */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-600 rounded-lg px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Darker filter dropdown
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Messages List */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                {" "}
                {/* Darker card background */}
                <div className="p-6 border-b border-gray-700">
                  {" "}
                  {/* Darker border */}
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-blue-400" />{" "}
                    {/* Blue icon */}
                    {activeTab === "pending" && "Pending Submissions"}
                    {activeTab === "approved" && "Approved Projects"}
                    {activeTab === "rejected" && "Rejected Projects"}
                  </h2>
                </div>
                <div className="divide-y divide-gray-700">
                  {" "}
                  {/* Darker dividers */}
                  {/* Display projects based on currentTabProjects */}
                  {currentTabProjects.length > 0 ? (
                    currentTabProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => {
                          // Only allow selection for pending projects
                          if (activeTab === "pending") {
                            setSelectedMessage(project);
                            // Pre-fill rejection reason if it exists (e.g., if re-selecting)
                            setRejectionReasonInput(
                              project.review_reason || ""
                            );
                          }
                        }}
                        className={`p-6 ${
                          activeTab === "pending"
                            ? "cursor-pointer hover:bg-gray-700" // Darker hover for pending
                            : ""
                        } ${
                          selectedMessage?.id === project.id &&
                          activeTab === "pending"
                            ? "bg-gray-700 border-l-4 border-blue-500" // Darker selected, blue border
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full flex items-center justify-center">
                                {" "}
                                {/* Darker gradients */}
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                {/* Ensure 'uploaded_by' is returned by your Project.serialize() */}
                                <h3 className="font-semibold text-white">
                                  {project.uploaded_by || "Unknown Uploader"}
                                </h3>
                                {/* If you have a student ID in project, use it here, e.g., project.uploader_id */}
                                {/* <p className="text-sm text-gray-400">ID: {project.uploader_id || "N/A"}</p> */}
                              </div>
                            </div>
                            <h4 className="font-medium text-white mb-2">
                              {project.title}
                            </h4>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="bg-gray-700 px-2 py-1 rounded">
                                {" "}
                                {/* Darker category tag */}
                                {project.category || "Uncategorized"}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(
                                  project.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {project.review_reason &&
                              activeTab === "rejected" && (
                                <div className="bg-red-900/30 p-3 rounded-lg mt-3">
                                  {" "}
                                  {/* Darker red background */}
                                  <p className="text-sm text-red-300">
                                    {" "}
                                    {/* Lighter red text */}
                                    <strong>Reason:</strong>{" "}
                                    {project.review_reason}
                                  </p>
                                </div>
                              )}
                          </div>
                          {activeTab === "pending" && (
                            <Clock className="w-5 h-5 text-amber-400 mt-1" />
                          )}
                          {activeTab === "approved" && (
                            <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                          )}
                          {activeTab === "rejected" && (
                            <XCircle className="w-6 h-6 text-red-400 mt-1" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      {activeTab === "pending" && (
                        <>
                          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />{" "}
                          {/* Darker gray icon */}
                          <h3 className="text-lg font-medium text-white mb-2">
                            No pending submissions
                          </h3>
                          <p className="text-gray-400">
                            All submissions have been reviewed!
                          </p>
                        </>
                      )}
                      {activeTab === "approved" && (
                        <>
                          <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />{" "}
                          {/* Darker gray icon */}
                          <h3 className="text-lg font-medium text-white mb-2">
                            No approved projects
                          </h3>
                          <p className="text-gray-400">
                            Start reviewing submissions to build your approved
                            projects list!
                          </p>
                        </>
                      )}
                      {activeTab === "rejected" && (
                        <>
                          <XCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />{" "}
                          {/* Darker gray icon */}
                          <h3 className="text-lg font-medium text-white mb-2">
                            No rejected projects
                          </h3>
                          <p className="text-gray-400">
                            All submissions met the requirements!
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                {" "}
                {/* Darker background */}
                <div className="p-6 border-b border-gray-700">
                  {" "}
                  {/* Darker border */}
                  <h3 className="text-lg font-semibold text-white">
                    Review Actions
                  </h3>
                </div>
                {selectedMessage ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="font-semibold text-white mb-2">
                        {selectedMessage.title}
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-300">
                            {" "}
                            {/* Lighter gray text */}
                            Uploader:
                          </span>
                          <p className="text-gray-400">
                            {selectedMessage.uploaded_by || "Unknown Uploader"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">
                            Category:
                          </span>
                          <p className="text-gray-400">
                            {selectedMessage.category || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">
                            Submitted:
                          </span>
                          <p className="text-gray-400">
                            {new Date(
                              selectedMessage.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">
                            Description:
                          </span>
                          <p className="text-gray-400 mt-1">
                            {selectedMessage.description}
                          </p>
                        </div>
                        {selectedMessage.github_link && (
                          <div>
                            <span className="font-medium text-gray-300">
                              GitHub:
                            </span>
                            <p className="text-gray-400">
                              <a
                                href={selectedMessage.github_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                View on GitHub
                              </a>
                            </p>
                          </div>
                        )}
                        {selectedMessage.file && ( // Display uploaded file link
                          <div>
                            <span className="font-medium text-gray-300">
                              Uploaded File:
                            </span>
                            <p className="text-gray-400">
                              <a
                                href={`${API_BASE_URL}${selectedMessage.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                View File
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => handleApprove(selectedMessage.id)}
                        className="w-full bg-green-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2" // Darker green
                        disabled={isLoading}
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve Project</span>
                      </button>

                      <div>
                        <textarea
                          placeholder="Provide reason for rejection (required)"
                          className="w-full border border-gray-600 rounded-lg p-3 text-sm bg-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" // Darker textarea
                          rows="3"
                          value={rejectionReasonInput} // Controlled component
                          onChange={(e) =>
                            setRejectionReasonInput(e.target.value)
                          }
                        />
                        <button
                          onClick={() => handleReject(selectedMessage.id)}
                          className="w-full mt-2 bg-red-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2" // Darker red
                          disabled={isLoading}
                        >
                          <XCircle className="w-5 h-5" />
                          <span>Reject Project</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />{" "}
                    {/* Darker icon */}
                    <h4 className="font-medium text-white mb-2">
                      Select a Submission
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Choose a pending submission from the list to review and
                      take action.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
