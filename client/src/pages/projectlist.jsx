import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  X,
  User,
  Calendar,
  Tag,
  Search,
  Home,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  ExternalLink,
  Github,
  DollarSign,
  Briefcase,
} from "lucide-react";

const ProjectLayout = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    reviewerName: "Anonymous User", // Default value, will be updated by user profile
  });
  const [hoverRating, setHoverRating] = useState(0); // New state for star hover effect
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const API_BASE_URL = "http://127.0.0.1:5555"; // Your API base URL

  const projectHeightsRef = useRef({});

  const getRandomHeight = () => {
    const minHeight = 250;
    const maxHeight = 400;
    return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserEmail(userData.email);
          setUsername(userData.username);
          setUserRole(userData.role);
          setNewReview((prev) => ({
            ...prev,
            reviewerName: userData.username, // Set reviewerName from fetched username
          }));
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUserEmail(null);
          setUsername(null);
          setUserRole(null);
          navigate("/login");
        }
      } catch (error) {
        // Handle network errors or other issues
        console.error("Error fetching user profile:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const projectsWithHeights = data.map((project) => {
          if (!projectHeightsRef.current[project.id]) {
            projectHeightsRef.current[project.id] = getRandomHeight();
          }
          return project;
        });
        setProjects(projectsWithHeights);
      } catch (err) {
        setError("Failed to load projects.");
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUserEmail(null);
    setUsername(null);
    setUserRole(null);
    navigate("/login");
  };

  const filteredAndApprovedProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedFilterCategory === "All" ||
        project.category === selectedFilterCategory;
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return project.isApproved && matchesCategory && matchesSearch;
    });
  }, [projects, selectedFilterCategory, searchTerm]);

  // Projects to display are already filtered and approved
  const projectsToDisplay = filteredAndApprovedProjects;

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleAddReview = async () => {
    if (!userEmail) {
      alert("Please log in to submit a review.");
      return;
    }
    if (!selectedProject) return;

    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/api/projects/${selectedProject.id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            rating: parseInt(newReview.rating),
            comment: newReview.comment,
            reviewerName: username, // Ensure reviewerName is sent from state
          }),
        }
      );

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj.id === updatedProject.id ? updatedProject : proj
          )
        );
        setSelectedProject((prevSelected) =>
          prevSelected.id === updatedProject.id ? updatedProject : prevSelected
        );
        setNewReview({
          rating: 5,
          comment: "",
          reviewerName: username, // Reset with current username
        });
        alert("Review added successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to add review: ${errorData.msg || response.statusText}`);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert("An error occurred while adding the review. Please try again.");
    }
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getStatusBadge = (project) => {
    if (project.isApproved) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" /> Approved
        </span>
      );
    } else if (project.review_reason) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <XCircle className="w-4 h-4 mr-1" /> Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
          <Clock className="w-4 h-4 mr-1" /> Pending
        </span>
      );
    }
  };

  const getRatingDistribution = (reviews) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (!reviews || reviews.length === 0) return distribution;

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const getHomeLink = () => {
    if (userRole === "admin") {
      return "/admin-dashboard";
    } else if (userRole === "student") {
      return "/dashboard";
    } else {
      return "/home"; // Default home if role is unknown or not set
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 fixed left-0 top-0 h-full z-40 shadow-sm">
        <nav className="flex flex-col gap-2">
          <Link
            to={getHomeLink()}
            className="p-3 rounded-full bg-teal-500 text-white hover:bg-teal-700 transition-colors"
          >
            <Home size={20} />
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          {username && (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors" // Changed text-black to text-white for better contrast
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-20">
        {/* Header/Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">
              Projects
            </h1>
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* You could add category filters here if desired */}
          </div>
        </header>

        {/* Projects Grid */}
        <main className="px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {filteredAndApprovedProjects.length === 0 && (
              <p className="text-center text-gray-600 text-xl mt-10">
                No projects found matching your criteria.
              </p>
            )}

            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
              {projectsToDisplay.map((project) => (
                <div
                  key={project.id}
                  className="relative break-inside-avoid bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    height: `${projectHeightsRef.current[project.id]}px`,
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-2xl">
                    <img
                      src={
                        project.image_url ||
                        "https://via.placeholder.com/400x400?text=No+Image"
                      }
                      alt={project.title}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        hoveredCard === project.id
                          ? "brightness-75 scale-105"
                          : "brightness-100 scale-100"
                      }`}
                    />

                    <div className="h-screen absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-bold text-teal-500 mb-1 drop-shadow-sm">
                        {project.title}
                      </h3>
                      <p className="text-teal-500 font-bold text-sm drop-shadow-sm">
                        By: {project.uploaded_by}
                      </p>

                      {project.reviews && project.reviews.length > 0 && (
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="text-white text-sm ml-1 drop-shadow-sm">
                            {getAverageRating(project.reviews)}
                          </span>
                        </div>
                      )}
                    </div>

                    <span className="absolute top-3 right-3 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-auto my-2 flex flex-col lg:flex-row overflow-hidden">
              <div className="relative lg:w-1/2 h-80 lg:h-auto">
                <img
                  src={
                    selectedProject.image_url ||
                    "https://via.placeholder.com/600x400?text=No+Image"
                  }
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg text-gray-700 hover:bg-white transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="lg:w-1/2 p-4 flex flex-col">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedProject.title}
                </h2>
                <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6 gap-y-2">
                  <div className="flex items-center mr-6">
                    <User className="w-4 h-4 mr-2" />
                    <span>By: {selectedProject.uploaded_by}</span>
                  </div>
                  <div className="flex items-center mr-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{selectedProject.date}</span>
                  </div>
                  <div className="flex items-center mr-6">
                    <Tag className="w-4 h-4 mr-2" />
                    <span>{selectedProject.category}</span>
                  </div>
                  {selectedProject.price !== undefined &&
                    selectedProject.price !== null && (
                      <div className="flex items-center mr-6">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        <span>Cost: KSh {selectedProject.price}</span>
                      </div>
                    )}
                  {selectedProject.collaborators &&
                    selectedProject.collaborators.length > 0 && (
                      <div className="flex items-center mr-6">
                        <Users className="w-4 h-4 mr-2" />
                        <span>
                          Collaborators:{" "}
                          {selectedProject.collaborators
                            .map((c) => c.name)
                            .join(", ")}
                        </span>
                      </div>
                    )}

                  {selectedProject.tech_stack && (
                    <div className="flex items-center mr-6">
                      <Tag className="w-4 h-4 mr-2" />
                      <span>
                        Tech Stack:{" "}
                        {Array.isArray(selectedProject.tech_stack)
                          ? selectedProject.tech_stack.join(", ")
                          : selectedProject.tech_stack}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed flex-1">
                  {selectedProject.description}
                </p>
                <div className="flex space-x-3 mb-6 flex-wrap gap-y-3">
                  {" "}
                  {/* Added flex-wrap and gap-y for better mobile display */}
                  {selectedProject.github_link && (
                    <a
                      href={selectedProject.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Github className="w-4 h-4 mr-2" /> GitHub
                    </a>
                  )}
                  {selectedProject.live_preview_url && (
                    <a
                      href={selectedProject.live_preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-full text-sm hover:bg-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                    </a>
                  )}
                  {selectedProject.buy_me_coffee_link && (
                    <a
                      href={selectedProject.buy_me_coffee_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <DollarSign className="w-4 h-4 mr-2" /> Buy Me Coffee
                    </a>
                  )}
                  {selectedProject.contactEmail && (
                    <a
                      href={`mailto:${selectedProject.contactEmail}`}
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      {selectedProject.collaborators &&
                      selectedProject.collaborators.length > 0
                        ? "Hire Team"
                        : "Hire Me"}
                    </a>
                  )}
                </div>
                {selectedProject.contactEmail && (
                  <div className="mb-4">
                    <span className="font-semibold text-gray-800">
                      Contact:
                    </span>{" "}
                    <a
                      href={`mailto:${selectedProject.contactEmail}`}
                      className="text-amber-600 hover:underline"
                    >
                      {selectedProject.contactEmail}
                    </a>
                  </div>
                )}
                {selectedProject.review_reason && (
                  <div className="mb-4 text-red-600 text-sm">
                    <span className="font-semibold">Rejection Reason:</span>{" "}
                    {selectedProject.review_reason}
                  </div>
                )}
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Reviews
                  </h3>
                  {selectedProject.reviews &&
                  selectedProject.reviews.length > 0 ? (
                    <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                      {" "}
                      {/* Increased max-h to 40 for more visibility */}
                      <div className="mb-4">
                        <span className="font-semibold text-gray-800 mr-2">
                          Average Rating:
                        </span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < getAverageRating(selectedProject.reviews)
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            ({getAverageRating(selectedProject.reviews)} / 5
                            Stars from {selectedProject.reviews.length} reviews)
                          </span>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            Rating Distribution:
                          </h4>
                          {Object.entries(
                            getRatingDistribution(selectedProject.reviews)
                          )
                            .sort(([a], [b]) => b - a)
                            .map(([stars, count]) => {
                              const totalReviews =
                                selectedProject.reviews.length;
                              const percentage =
                                totalReviews > 0
                                  ? (count / totalReviews) * 100
                                  : 0;
                              return (
                                <div
                                  key={stars}
                                  className="flex items-center mb-1"
                                >
                                  <span className="w-6 text-sm text-gray-600">
                                    {stars}★
                                  </span>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
                                    <div
                                      className="bg-amber-400 h-2.5 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600 w-8 text-right">
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      {selectedProject.reviews.map((review, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-xl shadow-sm"
                        >
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-gray-800 mr-2">
                              {review.reviewerName}
                            </span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-amber-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">
                                ({review.rating})
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">
                            "{review.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No reviews yet. Be the first to review!
                    </p>
                  )}

                  {userRole === "student" && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl">
                      <h4 className="text-lg font-semibold text-amber-800 mb-4">
                        Submit a Review
                      </h4>
                      <div className="mb-4">
                        <label
                          htmlFor="rating"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Rating:
                        </label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((starValue) => (
                            <Star
                              key={starValue}
                              className={`w-6 h-6 cursor-pointer transition-colors duration-200
                                ${
                                  (hoverRating || newReview.rating) >= starValue
                                    ? "text-amber-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              onClick={() =>
                                setNewReview((prev) => ({
                                  ...prev,
                                  rating: starValue,
                                }))
                              }
                              onMouseEnter={() => setHoverRating(starValue)}
                              onMouseLeave={() => setHoverRating(0)}
                            />
                          ))}
                          {(hoverRating > 0 || newReview.rating > 0) && (
                            <span className="ml-2 text-sm text-gray-600">
                              ({hoverRating || newReview.rating} Star
                              {(hoverRating || newReview.rating) > 1 ? "s" : ""}
                              )
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="comment"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Comment:
                        </label>
                        <textarea
                          id="comment"
                          name="comment"
                          value={newReview.comment}
                          onChange={handleReviewChange}
                          rows="4"
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none"
                          placeholder="Enter your comments here..."
                        ></textarea>
                      </div>
                      <button
                        onClick={handleAddReview}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectLayout;

