import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  User,
  Calendar,
  Filter,
} from "lucide-react";

const AdminDashboard = () => {
  const [pendingMessages, setPendingMessages] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [rejectedProjects, setRejectedProjects] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "all",
    "Web Development",
    "Mobile Development",
    "Blockchain",
    "IoT",
    "AI/ML",
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Handle unauthorized access
          return;
        }

        // Fetch pending projects
        const pendingRes = await fetch(
          "http://127.0.0.1:5000/api/projects?status=pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const pendingData = await pendingRes.json();
        setPendingMessages(pendingData);

        // Fetch approved projects
        const approvedRes = await fetch(
          "http://127.0.0.1:5000/api/projects?status=approved",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const approvedData = await approvedRes.json();
        setApprovedProjects(approvedData);

        // Fetch rejected projects
        const rejectedRes = await fetch(
          "http://127.0.0.1:5000/api/projects?status=rejected",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const rejectedData = await rejectedRes.json();
        setRejectedProjects(rejectedData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleApprove = async (projectId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:5000/api/projects/${projectId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const updatedProject = await res.json();
        setApprovedProjects((prev) => [...prev, updatedProject]);
        setPendingMessages((prev) =>
          prev.filter((msg) => msg.id !== projectId)
        );
        setSelectedMessage(null);
        showNotification(
          `Project "${updatedProject.title}" approved!`
        );
      }
    } catch (error) {
      console.error("Error approving project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (projectId, rejectionReason) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:5000/api/projects/${projectId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rejectionReason }),
        }
      );

      if (res.ok) {
        const rejectedProject = await res.json();
        setRejectedProjects((prev) => [...prev, rejectedProject]);
        setPendingMessages((prev) =>
          prev.filter((msg) => msg.id !== projectId)
        );
        setSelectedMessage(null);
        showNotification(
          `Project "${rejectedProject.title}" rejected.`
        );
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
    } finally {
      setIsLoading(false);
    }
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

  const filteredPendingMessages =
    filterCategory === "all"
      ? pendingMessages
      : pendingMessages.filter((msg) => msg.category === filterCategory);

  const filteredApprovedProjects =
    filterCategory === "all"
      ? approvedProjects
      : approvedProjects.filter((proj) => proj.category === filterCategory);

  const filteredRejectedProjects =
    filterCategory === "all"
      ? rejectedProjects
      : rejectedProjects.filter((proj) => proj.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage student project submissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <span className="text-blue-800 font-semibold">
                  {pendingMessages.length} Pending
                </span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-semibold">
                  {approvedProjects.length} Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {["pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "pending" && ` (${pendingMessages.length})`}
                {tab === "approved" && ` (${approvedProjects.length})`}
                {tab === "rejected" && ` (${rejectedProjects.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
                    {activeTab === "pending" && "Pending Submissions"}
                    {activeTab === "approved" && "Approved Projects"}
                    {activeTab === "rejected" && "Rejected Projects"}
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Pending Messages */}
                  {activeTab === "pending" &&
                    filteredPendingMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-6 cursor-pointer transition-all hover:bg-blue-50 ${
                          selectedMessage?.id === message.id
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {message.studentName || "Unknown Student"}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  ID: {message.studentId || "N/A"}
                                </p>
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {message.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {message.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {message.category || "Uncategorized"}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Clock className="w-5 h-5 text-amber-500 mt-1" />
                        </div>
                      </div>
                    ))}

                  {/* Approved Projects */}
                  {activeTab === "approved" &&
                    filteredApprovedProjects.map((project) => (
                      <div key={project.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {project.studentName || "Unknown Student"}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  ID: {project.studentId || "N/A"}
                                </p>
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {project.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {project.category || "Uncategorized"}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Approved:{" "}
                                {new Date(project.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                        </div>
                      </div>
                    ))}

                  {/* Rejected Projects */}
                  {activeTab === "rejected" &&
                    filteredRejectedProjects.map((project) => (
                      <div key={project.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {project.studentName || "Unknown Student"}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  ID: {project.studentId || "N/A"}
                                </p>
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {project.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {project.category || "Uncategorized"}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Rejected:{" "}
                                {new Date(project.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            {project.rejectionReason && (
                              <div className="bg-red-50 p-3 rounded-lg">
                                <p className="text-sm text-red-800">
                                  <strong>Reason:</strong>{" "}
                                  {project.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                          <XCircle className="w-6 h-6 text-red-500 mt-1" />
                        </div>
                      </div>
                    ))}

                  {/* Empty States */}
                  {activeTab === "pending" &&
                    filteredPendingMessages.length === 0 && (
                      <div className="p-12 text-center">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No pending submissions
                        </h3>
                        <p className="text-gray-500">
                          All submissions have been reviewed!
                        </p>
                      </div>
                    )}

                  {activeTab === "approved" &&
                    filteredApprovedProjects.length === 0 && (
                      <div className="p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No approved projects
                        </h3>
                        <p className="text-gray-500">
                          Start reviewing submissions to build your approved
                          projects list!
                        </p>
                      </div>
                    )}

                  {activeTab === "rejected" &&
                    filteredRejectedProjects.length === 0 && (
                      <div className="p-12 text-center">
                        <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No rejected projects
                        </h3>
                        <p className="text-gray-500">
                          All submissions met the requirements!
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Review Actions
                  </h3>
                </div>

                {selectedMessage ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {selectedMessage.title}
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Student:
                          </span>
                          <p className="text-gray-600">
                            {selectedMessage.studentName} (
                            {selectedMessage.studentId})
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Category:
                          </span>
                          <p className="text-gray-600">
                            {selectedMessage.category}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Submitted:
                          </span>
                          <p className="text-gray-600">
                            {new Date(selectedMessage.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Description:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {selectedMessage.description}
                          </p>
                        </div>
                        {selectedMessage.githubLink && (
                          <div>
                            <span className="font-medium text-gray-700">
                              GitHub:
                            </span>
                            <p className="text-gray-600">
                              <a
                                href={selectedMessage.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View on GitHub
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => handleApprove(selectedMessage.id)}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        disabled={isLoading}
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve Project</span>
                      </button>

                      <div>
                        <textarea
                          placeholder="Provide reason for rejection (required)"
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows="3"
                          id={`rejection-reason-${selectedMessage.id}`}
                        />
                        <button
                          onClick={() => {
                            const reason = document.getElementById(
                              `rejection-reason-${selectedMessage.id}`
                            ).value;
                            handleReject(selectedMessage.id, reason);
                          }}
                          className="w-full mt-2 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
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
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">
                      Select a Submission
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Choose a pending submission from the list to review and take
                      action.
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Submissions</span>
                    <span className="font-semibold text-gray-900">
                      {pendingMessages.length +
                        approvedProjects.length +
                        rejectedProjects.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Approval Rate</span>
                    <span className="font-semibold text-green-600">
                      {approvedProjects.length + rejectedProjects.length > 0
                        ? Math.round(
                            (approvedProjects.length /
                              (approvedProjects.length +
                                rejectedProjects.length)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Review</span>
                    <span className="font-semibold text-amber-600">
                      {pendingMessages.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;