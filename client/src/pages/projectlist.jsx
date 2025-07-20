// import React, { useState, useMemo, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Star,
//   X,
//   User,
//   Calendar,
//   Tag,
//   ChevronLeft,
//   ChevronRight,
//   Search,

//   Home,
//   LogOut,
//   CheckCircle,
//   Clock,
//   XCircle,

//   Users,
//   ExternalLink,
//   Github,
//   DollarSign,
//   Briefcase,
// } from "lucide-react";

// const ProjectLayout = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: "",
//     reviewerName: "Anonymous User",
//   });
//   const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [userEmail, setUserEmail] = useState(null);
//   const [username, setUsername] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [projects, setProjects] = useState([]);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const API_BASE_URL = "http://127.0.0.1:5555";

//   // Ref to hold the heights for each project card to maintain consistency
//   const projectHeightsRef = useRef({});

//   // Function to generate random heights between 100mm (378px) and 400px
//   const getRandomHeight = () => {
//     const minHeight = 200; // 100mm converted to pixels (100mm ≈ 378px at 96 DPI)
//     const maxHeight = 400; // Adjusted max height to 400px
//     return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
//   };

//   // Fetch user profile on component mount
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       const accessToken = localStorage.getItem("access_token");
//       if (!accessToken) {
//         console.log("No access token found. User not logged in.");
//         setIsLoading(false);
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (response.ok) {
//           const userData = await response.json();
//           setUserEmail(userData.email);
//           setUsername(userData.username);
//           setUserRole(userData.role);
//           console.log("User data fetched:", userData);
//         } else {
//           console.error(
//             "Failed to fetch user profile:",
//             response.status,
//             response.statusText
//           );
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//           setUserEmail(null);
//           setUsername(null);
//           setUserRole(null);
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         navigate("/login");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [navigate]);

//   // Fetch projects from the backend
//   useEffect(() => {
//     const fetchProjects = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/projects`, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         // Initialize random heights for each project upon fetching
//         const projectsWithHeights = data.map((project) => {
//           if (!projectHeightsRef.current[project.id]) {
//             projectHeightsRef.current[project.id] = getRandomHeight();
//           }
//           return project;
//         });
//         setProjects(projectsWithHeights);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//         setError("Failed to load projects.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     setUserEmail(null);
//     setUsername(null);
//     setUserRole(null);
//     navigate("/login");
//   };

//   const defaultItemsPerPage = 25; // Increased for better grid display

//   const filteredAndApprovedProjects = useMemo(() => {
//     return projects.filter((project) => {
//       const matchesCategory =
//         selectedFilterCategory === "All" ||
//         project.category === selectedFilterCategory;
//       const matchesSearch = project.title
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       return project.isApproved && matchesCategory && matchesSearch;
//     });
//   }, [projects, selectedFilterCategory, searchTerm]);

//   const totalPages = Math.ceil(
//     filteredAndApprovedProjects.length / defaultItemsPerPage
//   );
//   const startIndex = (currentPage - 1) * defaultItemsPerPage;
//   const endIndex = startIndex + defaultItemsPerPage;
//   const currentPaginatedProjects = filteredAndApprovedProjects.slice(
//     startIndex,
//     endIndex
//   );

//   const handleReviewChange = (e) => {
//     const { name, value } = e.target;
//     setNewReview((prevReview) => ({
//       ...prevReview,
//       [name]: value,
//     }));
//   };

//   const handleAddReview = async () => {
//     if (!userEmail) {
//       alert("Please log in to submit a review.");
//       return;
//     }
//     if (!selectedProject) return;

//     try {
//       const accessToken = localStorage.getItem("access_token");
//       const response = await fetch(
//         `${API_BASE_URL}/api/projects/${selectedProject.id}/reviews`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify({
//             rating: parseInt(newReview.rating),
//             comment: newReview.comment,
//             reviewerName: username,
//           }),
//         }
//       );

//       if (response.ok) {
//         const updatedProject = await response.json();
//         setProjects((prevProjects) =>
//           prevProjects.map((proj) =>
//             proj.id === updatedProject.id ? updatedProject : proj
//           )
//         );
//         setSelectedProject((prevSelected) =>
//           prevSelected.id === updatedProject.id ? updatedProject : prevSelected
//         );
//         setNewReview({
//           rating: 5,
//           comment: "",
//           reviewerName: username,
//         });
//         alert("Review added successfully!");
//       } else {
//         const errorData = await response.json();
//         alert(`Failed to add review: ${errorData.msg || response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error adding review:", error);
//       alert("An error occurred while adding the review.");
//     }
//   };

//   const getAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//     return (totalRating / reviews.length).toFixed(1);
//   };

//   const getStatusBadge = (project) => {
//     if (project.isApproved) {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//           <CheckCircle className="w-4 h-4 mr-1" /> Approved
//         </span>
//       );
//     } else if (project.review_reason) {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
//           <XCircle className="w-4 h-4 mr-1" /> Rejected
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
//           <Clock className="w-4 h-4 mr-1" /> Pending
//         </span>
//       );
//     }
//   };

//   const getRatingDistribution = (reviews) => {
//     const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     if (!reviews || reviews.length === 0) return distribution;

//     reviews.forEach((review) => {
//       if (review.rating >= 1 && review.rating <= 5) {
//         distribution[review.rating]++;
//       }
//     });
//     return distribution;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="text-red-500 text-lg">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Left Sidebar - Pinterest Style */}
//       <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 fixed left-0 top-0 h-full z-40 shadow-sm">
//         <nav className="flex flex-col gap-2">
//           <Link
//             to="/admin-dashboard"
//             className="p-3 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors"
//           >
//             <Home size={20} />
//           </Link>
//         </nav>

//         {/* Bottom Icons */}
//         <div className="mt-auto flex flex-col gap-2">
//           {/* User profile placeholder */}
//           <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
//             {username ? username.charAt(0).toUpperCase() : "U"}
//           </div>
//           <button
//             onClick={handleLogout}
//             className="p-3 rounded-full hover:bg-teal-100 text-teal-600 transition-colors"
//           >
//             <LogOut size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 ml-20">
//         {" "}
//         {/* Pushes content to the right of the fixed sidebar */}
//         {/* Top Header (Search and Filter) */}
//         <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
//           <div className="flex items-center justify-between max-w-7xl mx-auto">
//             <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">
//               Projects
//             </h1>{" "}
//             {/* Added a title */}
//             <div className="flex-1 max-w-2xl mx-auto">
//               <div className="relative">
//                 <Search
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search projects..."
//                   className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </header>
//         {/* Main Content Area for Projects */}
//         <main className="px-6 py-6">
//           <div className="max-w-7xl mx-auto">
//             {" "}
//             {/* Increased max-width for more columns */}
//             {filteredAndApprovedProjects.length === 0 && (
//               <p className="text-center text-gray-600 text-xl mt-10">
//                 No projects found matching your criteria.
//               </p>
//             )}
//             {/* Pinterest-Style Grid - Exactly 5 columns */}
//             <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
//               {" "}
//               {/* Changed to columns for masonry */}
//               {currentPaginatedProjects.map((project) => (
//                 <div
//                   key={project.id}
//                   className="relative break-inside-avoid bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
//                   onMouseEnter={() => setHoveredCard(project.id)}
//                   onMouseLeave={() => setHoveredCard(null)}
//                   onClick={() => setSelectedProject(project)}
//                   style={{
//                     height: `${projectHeightsRef.current[project.id]}px`,
//                   }} // Apply random height
//                 >
//                   <div className="relative w-full h-full overflow-hidden rounded-2xl">
//                     <img
//                       src={
//                         project.image_url ||
//                         "https://via.placeholder.com/400x400?text=No+Image"
//                       }
//                       alt={project.title}
//                       className={`w-full h-full object-cover transition-all duration-300 ${
//                         hoveredCard === project.id
//                           ? "brightness-75 scale-105"
//                           : "brightness-100 scale-100"
//                       }`}
//                     />

//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                     {/* Content Overlay */}
//                     <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                       <h3 className="text-lg font-bold text-teal-500 transition-colors duration-200 mb-1 drop-shadow-sm">
//                         {project.title}
//                       </h3>
//                       <p className="text-teal-500 font-bold text-sm drop-shadow-sm">
//                         By: {project.uploaded_by}
//                       </p>

//                       {/* Rating */}
//                       {project.reviews && project.reviews.length > 0 && (
//                         <div className="flex items-center mt-2">
//                           <Star className="w-4 h-4 text-teal-400 fill-current" />
//                           <span className="text-white text-sm ml-1 drop-shadow-sm">
//                             {getAverageRating(project.reviews)}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Category Badge - Top Right */}
//                     <span className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       {project.category}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pagination - Pinterest Style */}
//           {filteredAndApprovedProjects.length > defaultItemsPerPage && (
//             <div className="flex justify-center items-center space-x-2 mt-12">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="p-3 rounded-full bg-white text-gray-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>

//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }

//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setCurrentPage(pageNum)}
//                     className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
//                       currentPage === pageNum
//                         ? "bg-teal-600 text-white shadow-md"
//                         : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}

//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="p-3 rounded-full bg-white text-gray-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           )}
//         </main>
//         {/* Project Details Modal - Enhanced Pinterest Style */}
//         {selectedProject && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
//             <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-auto my-8 flex flex-col lg:flex-row overflow-hidden">
//               <div className="relative lg:w-1/2 h-80 lg:h-auto">
//                 <img
//                   src={
//                     selectedProject.image_url ||
//                     "https://via.placeholder.com/600x400?text=No+Image"
//                   }
//                   alt={selectedProject.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <button
//                   onClick={() => setSelectedProject(null)}
//                   className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg text-gray-700 hover:bg-white transition-all duration-200"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="lg:w-1/2 p-8 flex flex-col">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                   {selectedProject.title}
//                 </h2>

//                 <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6 gap-y-2">
//                   <div className="flex items-center mr-6">
//                     <User className="w-4 h-4 mr-2" />
//                     <span>By: {selectedProject.uploaded_by}</span>
//                   </div>
//                   <div className="flex items-center mr-6">
//                     <Calendar className="w-4 h-4 mr-2" />
//                     <span>{selectedProject.date}</span>
//                   </div>
//                   <div className="flex items-center mr-6">
//                     <Tag className="w-4 h-4 mr-2" />
//                     <span>{selectedProject.category}</span>
//                   </div>
//                   {selectedProject.price !== undefined &&
//                     selectedProject.price !== null && (
//                       <div className="flex items-center mr-6">
//                         <DollarSign className="w-4 h-4 mr-2 text-green-600" />
//                         <span>Cost: KSh {selectedProject.price}</span>
//                       </div>
//                     )}
//                   {selectedProject.collaborators &&
//                     selectedProject.collaborators.length > 0 && (
//                       <div className="flex items-center mr-6">
//                         <Users className="w-4 h-4 mr-2" />
//                         <span>
//                           Collaborators:{" "}
//                           {Array.isArray(selectedProject.collaborators)
//                             ? selectedProject.collaborators.join(", ")
//                             : selectedProject.collaborators}
//                         </span>
//                       </div>
//                     )}
//                   {selectedProject.tech_stack && (
//                     <div className="flex items-center mr-6">
//                       <Tag className="w-4 h-4 mr-2" />
//                       <span>
//                         Tech Stack:{" "}
//                         {Array.isArray(selectedProject.tech_stack)
//                           ? selectedProject.tech_stack.join(", ")
//                           : selectedProject.tech_stack}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <p className="text-gray-700 mb-6 leading-relaxed flex-1">
//                   {selectedProject.description}
//                 </p>

//                 <div className="flex space-x-3 mb-6">
//                   {selectedProject.github_link && (
//                     <a
//                       href={selectedProject.github_link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
//                     >
//                       <Github className="w-4 h-4 mr-2" /> GitHub
//                     </a>
//                   )}
//                   {selectedProject.live_preview_url && (
//                     <a
//                       href={selectedProject.live_preview_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-full text-sm hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow-md"
//                     >
//                       <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
//                     </a>
//                   )}
//                   {selectedProject.contactEmail && (
//                     <a
//                       href={`mailto:${selectedProject.contactEmail}`}
//                       className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
//                     >
//                       <Briefcase className="w-4 h-4 mr-2" />
//                       {selectedProject.collaborators &&
//                       selectedProject.collaborators.length > 0
//                         ? "Hire Team"
//                         : "Hire Me"}
//                     </a>
//                   )}
//                 </div>

//                 {selectedProject.contactEmail && (
//                   <div className="mb-4">
//                     <span className="font-semibold text-gray-800">
//                       Contact:
//                     </span>{" "}
//                     <a
//                       href={`mailto:${selectedProject.contactEmail}`}
//                       className="text-teal-600 hover:underline"
//                     >
//                       {selectedProject.contactEmail}
//                     </a>
//                   </div>
//                 )}

//                 {selectedProject.review_reason && (
//                   <div className="mb-4 text-red-600 text-sm">
//                     <span className="font-semibold">Rejection Reason:</span>{" "}
//                     {selectedProject.review_reason}
//                   </div>
//                 )}

//                 {/* Reviews Section */}
//                 <div className="mt-auto pt-6 border-t border-gray-200">
//                   <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                     Reviews
//                   </h3>
//                   {selectedProject.reviews &&
//                   selectedProject.reviews.length > 0 ? (
//                     <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
//                       <div className="mb-4">
//                         <span className="font-semibold text-gray-800 mr-2">
//                           Average Rating:
//                         </span>
//                         <div className="flex items-center">
//                           {Array.from({ length: 5 }, (_, i) => (
//                             <Star
//                               key={i}
//                               className={`w-5 h-5 ${
//                                 i < getAverageRating(selectedProject.reviews)
//                                   ? "text-teal-400"
//                                   : "text-gray-300"
//                               }`}
//                               fill="currentColor"
//                             />
//                           ))}
//                           <span className="text-sm text-gray-600 ml-2">
//                             ({getAverageRating(selectedProject.reviews)} / 5
//                             Stars from {selectedProject.reviews.length} reviews)
//                           </span>
//                         </div>

//                         <div className="mt-4">
//                           <h4 className="text-lg font-semibold text-gray-800 mb-2">
//                             Rating Distribution:
//                           </h4>
//                           {Object.entries(
//                             getRatingDistribution(selectedProject.reviews)
//                           )
//                             .sort(([a], [b]) => b - a)
//                             .map(([stars, count]) => {
//                               const totalReviews =
//                                 selectedProject.reviews.length;
//                               const percentage =
//                                 totalReviews > 0
//                                   ? (count / totalReviews) * 100
//                                   : 0;
//                               return (
//                                 <div
//                                   key={stars}
//                                   className="flex items-center mb-1"
//                                 >
//                                   <span className="w-6 text-sm text-gray-600">
//                                     {stars}★
//                                   </span>
//                                   <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
//                                     <div
//                                       className="bg-teal-400 h-2.5 rounded-full"
//                                       style={{ width: `${percentage}%` }}
//                                     ></div>
//                                   </div>
//                                   <span className="text-sm text-gray-600 w-8 text-right">
//                                     {count}
//                                   </span>
//                                 </div>
//                               );
//                             })}
//                         </div>
//                       </div>

//                       {selectedProject.reviews.map((review, index) => (
//                         <div
//                           key={index}
//                           className="bg-gray-50 p-4 rounded-xl shadow-sm"
//                         >
//                           <div className="flex items-center mb-2">
//                             <span className="font-semibold text-gray-800 mr-2">
//                               {review.reviewerName}
//                             </span>
//                             <div className="flex items-center">
//                               {Array.from({ length: 5 }, (_, i) => (
//                                 <Star
//                                   key={i}
//                                   className={`w-4 h-4 ${
//                                     i < review.rating
//                                       ? "text-teal-400"
//                                       : "text-gray-300"
//                                   }`}
//                                   fill="currentColor"
//                                 />
//                               ))}
//                               <span className="text-sm text-gray-600 ml-2">
//                                 ({review.rating})
//                               </span>
//                             </div>
//                           </div>
//                           <p className="text-gray-700 text-sm">
//                             "{review.comment}"
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-600">
//                       No reviews yet. Be the first to review!
//                     </p>
//                   )}

//                   {/* Add Review Form */}
//                   {userRole === "student" && (
//                     <div className="mt-6 p-6 bg-teal-50 rounded-xl">
//                       <h4 className="text-lg font-semibold text-teal-800 mb-4">
//                         Submit a Review
//                       </h4>
//                       <div className="mb-4">
//                         <label
//                           htmlFor="rating"
//                           className="block text-gray-700 text-sm font-bold mb-2"
//                         >
//                           Rating:
//                         </label>
//                         <select
//                           id="rating"
//                           name="rating"
//                           value={newReview.rating}
//                           onChange={handleReviewChange}
//                           className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
//                         >
//                           {[1, 2, 3, 4, 5].map((num) => (
//                             <option key={num} value={num}>
//                               {num} Star{num > 1 ? "s" : ""}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="mb-6">
//                         <label
//                           htmlFor="comment"
//                           className="block text-gray-700 text-sm font-bold mb-2"
//                         >
//                           Comment:
//                         </label>
//                         <textarea
//                           id="comment"
//                           name="comment"
//                           value={newReview.comment}
//                           onChange={handleReviewChange}
//                           rows="4"
//                           className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 resize-none"
//                           placeholder="Enter your comments here..."
//                         ></textarea>
//                       </div>
//                       <button
//                         onClick={handleAddReview}
//                         className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
//                       >
//                         Submit Review
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectLayout;

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  X,
  User,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Home,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  FolderKanban,
  Users,
  ExternalLink,
  Github,
  DollarSign,
  Briefcase,
  Settings,
  Plus,
} from "lucide-react";

const ProjectLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const projects = [
    {
      id: 1,
      image: "https://picsum.photos/300/400?random=1",
      title: "Beautiful Mountain Landscape",
      description:
        "Breathtaking view of snow-capped mountains during golden hour.",
      category: "Landscape",
      developer: {
        name: "Rose Momanyi",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ8i8lVWP53CDVy_3uh21rk9qKhx4XdPR3nQ&s",
        bio: "Full Stack Developer passionate about turning ideas into reality. Specializing in React, Flask, and user experience.",
      },
    },
    {
      id: 2,
      image: "https://picsum.photos/300/600?random=2",
      title: "Modern Architecture Design",
      description: "Contemporary building design with clean lines.",
      category: "Design",
      developer: {
        name: "Dennis Ngui",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        bio: "Frontend Developer with a focus on clean, modern UI and smooth user interactions. Skilled in Tailwind and React.",
      },
    },
    {
      id: 3,
      image: "https://picsum.photos/300/500?random=3",
      title: "Creative Tech Art",
      description: "Fusion of art and technology in digital painting.",
      category: "Tech",
      developer: {
        name: "Mary Atieno",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        bio: "UX Designer and creative coder, bringing artistic flair to tech projects using Figma and Webflow.",
      },
    },
    {
      id: 4,
      image: "https://picsum.photos/300/420?random=4",
      title: "Night Sky Photography",
      description:
        "A clear view of the Milky Way captured from a remote desert.",
      category: "Photography",
      developer: {
        name: "James Mwangi",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        bio: "Back End Developer with a knack for APIs and performance optimization. Works with Django and PostgreSQL.",
      },
    },
    {
      id: 5,
      image: "https://picsum.photos/300/450?random=5",
      title: "Retro 8-bit Game",
      description: "An indie platformer built with love and pixel art.",
      category: "Games",
      developer: {
        name: "Linda Wanjiku",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        bio: "Game Developer and pixel artist blending fun and code using Phaser and Unity.",
      },
    },
    {
      id: 6,
      image: "https://picsum.photos/300/410?random=6",
      title: "Smart Home Dashboard",
      description: "Control your smart devices from one sleek interface.",
      category: "IoT",
      developer: {
        name: "Brian Otieno",
        image: "https://randomuser.me/api/portraits/men/6.jpg",
        bio: "IoT enthusiast and developer passionate about automation, MQTT, and real-time control systems.",
      },
    },
    {
      id: 7,
      image: "https://picsum.photos/300/600?random=7",
      title: "Fashion E-Commerce UI",
      description: "Mobile-first interface for a fashion retail startup.",
      category: "UI/UX",
      developer: {
        name: "Agnes Nyambura",
        image: "https://randomuser.me/api/portraits/women/7.jpg",
        bio: "UI/UX Designer focused on mobile experiences and design systems. Loves working with Figma and Tailwind.",
      },
    },
    {
      id: 8,
      image: "https://picsum.photos/300/500?random=8",
      title: "Finance Tracker App",
      description: "A simple app to track expenses and savings goals.",
      category: "Finance",
      developer: {
        name: "Samuel Kibe",
        image: "https://randomuser.me/api/portraits/men/8.jpg",
        bio: "React Native Developer passionate about building mobile-first fintech apps.",
      },
    },
    {
      id: 9,
      image: "https://picsum.photos/300/450?random=9",
      title: "AI Chatbot Assistant",
      description: "Conversational bot for customer support using NLP.",
      category: "AI",
      developer: {
        name: "Cynthia Wambui",
        image: "https://randomuser.me/api/portraits/women/9.jpg",
        bio: "Machine Learning engineer using Python and TensorFlow to build smarter assistants.",
      },
    },
    {
      id: 10,
      image: "https://picsum.photos/300/480?random=10",
      title: "Plant Identifier",
      description: "App that uses image recognition to identify plants.",
      category: "Education",
      developer: {
        name: "Elijah Kariuki",
        image: "https://randomuser.me/api/portraits/men/10.jpg",
        bio: "Full Stack Developer working with Flask, React, and machine vision for educational apps.",
      },
    },
  ];
  

  const filteredProjects = projects
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(
      (p) => selectedCategory === "All" || p.category === selectedCategory
    )
    .slice(0, visibleCount);

  const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div
        onClick={() => setSelectedProject(project)}
        className="break-inside-avoid mb-4 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
          <div className="relative overflow-hidden rounded-t-2xl">
            {!imageLoaded && (
              <div className="bg-gray-200 animate-pulse aspect-[3/4]" />
            )}
            <img
              src={project.image}
              alt={project.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full object-cover transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-95 rounded-lg" : ""}`}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${
              isHovered ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="p-4 bg-white">
              <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
                {project.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getHomeLink = () => {
    if (userRole === "admin") {
      return "/admin-dashboard";
    } else if (userRole === "student") {
      return "/dashboard";
    } else {
      return "/home";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 fixed left-0 top-0 h-full z-40 shadow-sm">
        <nav className="flex flex-col gap-2">
          <Link
            to={getHomeLink()}
            className="p-3 rounded-full  bg-teal-500 text-white hover:bg-teal-700 transition-colors"
          >
            <Home size={20} />
          </Link>
        </nav>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-full border-none outline-none text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 hover:bg-gray-700 rounded-full">
              <Bell size={20} />
            </button>
            <button className="p-3 hover:bg-gray-700 rounded-full">
              <MessageCircle size={20} />
            </button>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      {/* Category Buttons */}
      <div className="flex justify-center gap-3 flex-wrap mb-6 mt-6 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setVisibleCount(8);
            }}
            className={`px-4 py-2 rounded-full border transition text-sm ${
              selectedCategory === cat
                ? "bg-white text-black border-white"
                : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {filteredProjects.length === 0 ? (
            <p className="text-center col-span-full py-10">
              No projects found.
            </p>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>

        {filteredProjects.length <
          projects.filter(
            (p) =>
              p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (selectedCategory === "All" || p.category === selectedCategory)
          ).length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      <Dialog
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex items-start justify-center"
      >
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-auto my-8 flex flex-col lg:flex-row overflow-hidden">
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

              <div className="lg:w-1/2 p-8 flex flex-col">
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
                          {Array.isArray(selectedProject.collaborators)
                            ? selectedProject.collaborators.join(", ")
                            : selectedProject.collaborators}
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
                <p className="text-sm text-gray-500">
                  Category: {selectedProject.category}
                </p>
              </div>

              {/* Right: Developer Info */}
              <div className="w-full md:w-1/3 flex flex-col items-center text-center bg-gray-50 p-4 rounded-xl shadow-md">
                <img
                  src={selectedProject.developer.image}
                  alt={selectedProject.developer.name}
                  className="w-24 h-24 rounded-full mb-3 object-cover border-4 border-white shadow"
                />
                <h3 className="text-xl font-semibold mb-1">
                  {selectedProject.developer.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {selectedProject.developer.bio}
                </p>
                <Link to="/contact-me">
                  <button className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    Contact Me
                  </button>
                </Link>
              </div>
            </div>
          </Dialog.Panel>
        )}
      </div>
    </div>
  );
};

export default ProjectLayout;