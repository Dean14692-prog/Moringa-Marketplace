// "use client";
// import React, { useEffect, useId, useRef, useState, useCallback } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { ArrowLeft } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useOutsideClick } from "../components/ui/use-outside-click"; // Make sure this path is correct for your project

// // --- Icon Imports ---
// import {
//   IconBook,
//   IconStar,
//   IconExternalLink,
//   IconBrandGithub,
//   IconUsers, // Added for collaborators
// } from "@tabler/icons-react";

// export default function MyProjects({ limit }) {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]); // State to store fetched projects
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeProject, setActiveProject] = useState(null); // State for the active project in the modal
//   const ref = useRef(null);
//   const id = useId();

//   // Define your API base URL
//   const API_BASE_URL = "http://127.0.0.1:5555"; // Your Flask backend URL

//   // Fetch projects from the backend
//   const fetchUserProjects = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem("access_token");

//     if (!token) {
//       toast.error("Authentication required. Please log in.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/users/projects`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         if (res.status === 401 || res.status === 403) {
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//           toast.error("Session expired or unauthorized. Please log in again.");
//           navigate("/login");
//           return;
//         }
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       // Sort projects by submittedAt, newest first
//       const sortedProjects = data.sort((a, b) => {
//         const dateA = new Date(a.submittedAt);
//         const dateB = new Date(b.submittedAt);
//         return dateB - dateA; // Descending order (newest first)
//       });
//       setProjects(sortedProjects);
//     } catch (err) {
//       console.error("Error fetching user projects:", err);
//       setError("Failed to load your projects.");
//       toast.error("Failed to load your projects.");
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchUserProjects();

//     // Optional: Set up polling for projects if you want real-time updates
//     const pollingInterval = setInterval(fetchUserProjects, 60000); // Every minute
//     return () => clearInterval(pollingInterval);
//   }, [fetchUserProjects]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") setActiveProject(null);
//     };

//     if (activeProject) {
//       document.body.style.overflow = "hidden";
//       window.addEventListener("keydown", handleKeyDown);
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [activeProject]);

//   useOutsideClick(ref, () => setActiveProject(null));

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 items-center justify-center">
//         <div className="text-red-500 dark:text-red-400 text-lg">{error}</div>
//       </div>
//     );
//   }

//   // Apply limit if provided, otherwise show all
//   const displayedProjects = limit ? projects.slice(0, limit) : projects;

//   return (
//     <div className="px-6 py-6 min-h-screen bg-gray-50 dark:bg-neutral-900">
//       <Link
//         to="/dashboard"
//         className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200 mb-6 w-fit"
//       >
//         <ArrowLeft className="h-4 w-4" />
//         <span>Back to Dashboard</span>
//       </Link>

//       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//         My Submitted Projects
//       </h1>

//       {displayedProjects.length === 0 ? (
//         <p className="text-gray-600 dark:text-gray-400 text-lg text-center mt-10">
//           No projects submitted yet. Go to "Upload Projects" to add one!
//         </p>
//       ) : (
//         <ul className="max-w-2xl mx-auto w-full divide-y divide-gray-300 dark:divide-neutral-700">
//           {displayedProjects.map((project) => (
//             <motion.li
//               layoutId={`card-${project.id}-${id}`}
//               key={`card-${project.id}-${id}`}
//               onClick={() => setActiveProject(project)}
//               className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer rounded-lg transition-colors duration-200"
//             >
//               <div className="flex gap-4 flex-col md:flex-row mt-2 items-center md:items-start">
//                 <motion.div layoutId={`image-${project.id}-${id}`}>
//                   {project.fileUrl ? ( // If you still store a preview image URL
//                     <img
//                       src={project.fileUrl}
//                       alt={project.title}
//                       className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-center border border-gray-200 dark:border-neutral-700"
//                     />
//                   ) : (
//                     // Placeholder if no preview image
//                     <div className="h-40 w-40 md:h-14 md:w-14 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
//                       ZIP Project
//                     </div>
//                   )}
//                 </motion.div>

//                 <div>
//                   <motion.h3
//                     layoutId={`title-${project.id}-${id}`}
//                     className="font-medium text-black dark:text-white text-center md:text-left text-lg line-clamp-1"
//                   >
//                     {project.title}
//                   </motion.h3>
//                   <motion.p
//                     layoutId={`description-${project.id}-${id}`}
//                     className="text-gray-600 dark:text-gray-400 text-center md:text-left text-sm line-clamp-2"
//                   >
//                     {project.description}
//                   </motion.p>
//                   {/* Display Collaborators in the list view (optional, could be just in modal) */}
//                   {project.collaborators && project.collaborators.length > 0 && (
//                     <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       <IconUsers className="h-3 w-3 text-purple-500 dark:text-purple-400" />
//                       <span>{project.collaborators.map((c) => c.name).join(", ")}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <motion.span
//                 layoutId={`status-${project.id}-${id}`}
//                 className={`px-3 py-1 text-xs font-semibold rounded-full mt-4 md:mt-0
//                     ${
//                       project.status === "Approved"
//                         ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                         : project.status === "Rejected"
//                         ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                         : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
//                     }`}
//               >
//                 {project.status || "Pending"}
//               </motion.span>
//             </motion.li>
//           ))}
//         </ul>
//       )}

//       {/* Modal for active project */}
//       <AnimatePresence>
//         {activeProject && typeof activeProject === "object" && (
//           <motion.div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-10 grid place-items-center p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.button
//               key={`button-close-${activeProject.id}-${id}`}
//               layout
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0, transition: { duration: 0.05 } }}
//               className="absolute top-4 right-4 bg-gray-100 dark:bg-neutral-700 rounded-full h-8 w-8 flex items-center justify-center shadow-lg z-50"
//               onClick={() => setActiveProject(null)}
//             >
//               <CloseIcon className="text-black dark:text-white" />
//             </motion.button>

//             <motion.div
//               layoutId={`card-${activeProject.id}-${id}`}
//               ref={ref}
//               className="w-full max-w-[700px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-800 sm:rounded-3xl overflow-hidden shadow-2xl relative"
//             >
//               <motion.div layoutId={`image-${activeProject.id}-${id}`}>
//                 {activeProject.fileUrl ? ( // If you still store a preview image URL
//                   <img
//                     src={activeProject.fileUrl}
//                     alt={activeProject.title}
//                     className="w-full h-60 md:h-80 object-cover object-top"
//                   />
//                 ) : (
//                   // Placeholder for zip projects without a specific preview image
//                   <div className="w-full h-60 md:h-80 bg-gray-100 dark:bg-neutral-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg">
//                     ZIP Project - No Visual Preview
//                   </div>
//                 )}
//               </motion.div>

//               <div className="p-6 flex flex-col flex-grow">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <motion.h3
//                       layoutId={`title-${activeProject.id}-${id}`}
//                       className="font-bold text-gray-900 dark:text-white text-2xl mb-1"
//                     >
//                       {activeProject.title}
//                     </motion.h3>
//                     <motion.p
//                       layoutId={`description-${activeProject.id}-${id}`}
//                       className="text-gray-600 dark:text-gray-400 text-sm mb-2"
//                     >
//                       {activeProject.description}
//                     </motion.p>
//                   </div>
//                   <span
//                     className={`px-3 py-1 text-xs font-semibold rounded-full
//                     ${
//                       activeProject.status === "Approved"
//                         ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                         : activeProject.status === "Rejected"
//                         ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                         : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
//                     }`}
//                   >
//                     {activeProject.status || "Pending"}
//                   </span>
//                 </div>

//                 <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base mb-6 overflow-y-auto flex-grow [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
//                   <p className="mb-4">{activeProject.description}</p>
//                   {activeProject.category && (
//                     <p className="flex items-center gap-2 mb-2">
//                       <IconBook className="h-4 w-4 text-blue-500 dark:text-blue-400" />{" "}
//                       <strong>Category:</strong> {activeProject.category}
//                     </p>
//                   )}
//                   {activeProject.techStack && (
//                     <p className="flex items-center gap-2 mb-2">
//                       <IconStar className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />{" "}
//                       <strong>Tech Stack:</strong> {activeProject.techStack}
//                     </p>
//                   )}
//                   {activeProject.submittedAt && (
//                     <p className="flex items-center gap-2 mb-2">
//                       Submitted: {new Date(activeProject.submittedAt).toLocaleDateString()}
//                     </p>
//                   )}

//                   {/* Display Collaborators in the modal */}
//                   {activeProject.collaborators &&
//                     activeProject.collaborators.length > 0 && (
//                       <div className="mt-4">
//                         <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
//                           <IconUsers className="h-5 w-5 text-purple-600 dark:text-purple-400" />{" "}
//                           Collaborators:
//                         </h4>
//                         <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
//                           {activeProject.collaborators.map((collab, idx) => (
//                             <li key={idx}>
//                               {collab.name} {collab.email && `(${collab.email})`}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                   {activeProject.status === "Rejected" &&
//                     activeProject.adminNotes && (
//                       <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-xs">
//                         <p className="font-medium text-red-700 dark:text-red-300 mb-1">
//                           Admin Feedback:
//                         </p>
//                         <p className="text-red-600 dark:text-red-400">
//                           {activeProject.adminNotes}
//                         </p>
//                       </div>
//                     )}
//                 </div>

//                 {/* Action Buttons for download/preview */}
//                 <div className="flex flex-wrap gap-3 mt-auto">
//                   {/* Download ZIP File Button */}
//                   {activeProject.zipFileUrl && (
//                     <a
//                       href={`${API_BASE_URL}${activeProject.zipFileUrl}`} // Correct URL construction
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="mr-2 h-4 w-4"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//                           clipRule="evenodd"
//                         />
//                       </svg>{" "}
//                       Download ZIP
//                     </a>
//                   )}
//                   {activeProject.githubLink && (
//                     <a
//                       href={activeProject.githubLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition"
//                     >
//                       <IconBrandGithub className="mr-2 h-4 w-4" /> GitHub
//                     </a>
//                   )}
//                   {activeProject.livePreviewUrl && (
//                     <a
//                       href={activeProject.livePreviewUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
//                     >
//                       <IconExternalLink className="mr-2 h-4 w-4" /> Live Demo
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export const CloseIcon = ({ className }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={`h-4 w-4 ${className}`}
//   >
//     <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//     <path d="M18 6l-12 12" />
//     <path d="M6 6l12 12" />
//   </svg>
// );

// MyProjects.jsx
"use client";
import React, { useEffect, useId, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyProjects({ limit }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  // Define your API base URL
  const API_BASE_URL = "http://127.0.0.1:5555"; // Your Flask backend URL

  // Fetch projects from the backend
  const fetchUserProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("Authentication required. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching user projects:", err);
      setError("Failed to load projects.");
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProjects();
  }, [fetchUserProjects]);

  // Handle outside click for the modal
  useOutsideClick(ref, () => {
    if (activeProject) {
      setActiveProject(null);
    }
  });

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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" /> Pending
        </span>
      );
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const displayedCards = limit
    ? [...cards].reverse().slice(0, limit)
    : [...cards].reverse();

  return (
    <div className="divide-y divide-gray-200">
      <Link
        to="/dashboard"
        className="absolute top-4 left-4 flex items-center gap-2 text-sm text-black px-2 py-1 rounded hover:bg-zinc-200 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Home</span>
      </Link>

      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-2 right-2 lg:hidden bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center shadow"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4 mt-15">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-black"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-black"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>

                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-black text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!limit && projects.length > 3 && (
        <div className="mt-8 text-center">
          <Link
            to="/all-my-projects"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All My Projects
            <ArrowLeft className="ml-3 h-5 w-5 rotate-180" />
          </Link>
        </div>
      )}

      <ul className="max-w-2xl mx-auto w-full divide-y divide-gray-300">
        {displayedCards.map((card) => (
          <motion.li
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row mt-2">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-black text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-black text-center md:text-left"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {activeProject.title}
                </h3>
                <div className="flex flex-wrap items-center text-gray-600 text-sm mb-4 space-x-4">
                  <span className="flex items-center">
                    <IconBook className="mr-1 h-4 w-4" /> {activeProject.category}
                  </span>
                  <span className="flex items-center">
                    <IconStar className="mr-1 h-4 w-4 text-yellow-500" />{" "}
                    {activeProject.average_rating ? activeProject.average_rating.toFixed(1) : "N/A"} (
                    {activeProject.reviews ? activeProject.reviews.length : 0} reviews)
                  </span>
                  {activeProject.collaborators &&
                    activeProject.collaborators.length > 0 && (
                      <span className="flex items-center">
                        <IconUsers className="mr-1 h-4 w-4" />{" "}
                        {activeProject.collaborators.join(", ")}
                      </span>
                    )}
                </div>

            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export const CloseIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-4 w-4 ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

// Card Data
const cards = [
  {
    title: "Summertime Sadness",
    description: "Lana Del Rey",
    src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        Lana Del Rey is celebrated for her melancholic style.
      </p>
    ),
  },
  {
    title: "Mitran Di Chhatri",
    description: "Babbu Maan",
    src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        Babbu Maan is known for emotional Punjabi lyrics.
      </p>
    ),
  },
  {
    title: "For Whom The Bell Tolls",
    description: "Metallica",
    src: "https://assets.aceternity.com/demos/metallica.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        Metallica pioneers thrash metal and aggressive rhythms.
      </p>
    ),
  },
  {
    title: "Stairway To Heaven",
    description: "Led Zeppelin",
    src: "https://assets.aceternity.com/demos/led-zeppelin.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        Led Zeppelin blended blues, folk, and hard rock.
      </p>
    ),
  },
  {
    title: "Toh Phir Aao",
    description: "Mustafa Zahid",
    src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        "Toh Phir Aao" captures longing and emotion powerfully.
      </p>
    ),
  },
];
