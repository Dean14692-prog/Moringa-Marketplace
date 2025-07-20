import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import nasa3 from "../assets/nasa3.jpg"; // Background image

const MyProjects = () => { // Renamed component for clarity
  const [projects, setProjects] = useState([]); // State to hold the list of projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Helper function to get the JWT token
  const getAuthToken = () => {
    return localStorage.getItem("token"); // Use 'token' as per previous discussions
  };

  useEffect(() => {
    const fetchMyProjects = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        // No token found, redirect to login
        navigate("/student-signin"); // Or your actual login route
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/me/projects", { // <--- CHANGED API ENDPOINT
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If 401 Unauthorized, token is invalid/expired
          if (response.status === 401) {
            localStorage.removeItem("token"); // Clear invalid token
            navigate("/student-signin"); // Or your actual login route
            alert("Your session has expired. Please sign in again.");
          }
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data); // Set the fetched projects to state
      } catch (err) {
        console.error("Error fetching student projects:", err);
        setError("Failed to load your projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [navigate]); // Dependency array: re-run if navigate changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-xl font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 🌌 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: `url(${nasa3})` }}
      />
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-0" />

      {/* Content Card for Projects */}
      <div className="relative z-10 max-w-5xl mx-auto bg-white/90 p-6 rounded shadow-md mt-8 w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Uploaded Projects</h1>

        {projects.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">You haven't uploaded any projects yet. Go to the "Upload" section to add one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-sm text-gray-700 mb-1">Category: {project.category}</p>
                <p className="text-gray-800 text-sm mb-3">{project.description}</p>
                {project.file_url && (
                  <img
                    src={`http://localhost:5000${project.file_url}`} // Assuming your backend serves uploads
                    alt={project.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <div className="flex justify-between items-center text-sm">
                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      GitHub
                    </a>
                  )}
                  {project.demo_link && (
                    <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-2">
                      Live Demo
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Status: <span className={`font-medium ${project.status === 'Approved' ? 'text-green-600' : project.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{project.status}</span></p>
                {project.for_sale && <p className="text-green-700 font-bold mt-1">Price: ${project.price}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;