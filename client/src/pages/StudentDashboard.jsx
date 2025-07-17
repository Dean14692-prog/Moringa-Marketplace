// src/pages/StudentDashboard.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../components/Sidebar";
import { sidebarLinks } from "../constants/sidebarLinks";
import { Outlet, useNavigate } from "react-router-dom";

import nasaBackground from "../assets/nasa.jpg"; // Background image

const StudentDashboard = () => {
  // State to hold data fetched from backend
  const [studentData, setStudentData] = useState(null); // Stores the entire student object
  const [uploadedProjects, setUploadedProjects] = useState([]); // Stores projects from backend
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for API calls

  const navigate = useNavigate();

  // Helper function to get the JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("jwt_token");
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        // If no token, redirect to sign-in or home
        navigate("/student-signin");
        setLoading(false);
        return;
      }

      try {
        // Fetch student profile
        const studentRes = await fetch("http://localhost:5000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!studentRes.ok) {
          // If token is invalid or expired, redirect to login
          if (studentRes.status === 401) {
            localStorage.removeItem("jwt_token"); // Clear invalid token
            navigate("/student-signin");
            alert("Your session has expired. Please sign in again.");
          }
          throw new Error(`Failed to fetch student data: ${studentRes.statusText}`);
        }
        const studentProfile = await studentRes.json();
        setStudentData(studentProfile);

        // Fetch student's projects
        const projectsRes = await fetch("http://localhost:5000/api/me/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!projectsRes.ok) {
          throw new Error(`Failed to fetch projects: ${projectsRes.statusText}`);
        }
        const projects = await projectsRes.json();
        setUploadedProjects(projects);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, setting local preview. To persist, you'd need a backend endpoint
      // for profile picture upload and update the student's profile accordingly.
      // This is a more advanced feature not covered by the current backend setup.
      // For a full solution, you'd send this file to your backend and get a URL back.
      setStudentData(prev => ({ ...prev, profile_image_url: URL.createObjectURL(file) }));
    }
  };

  // --- NEW: Logout Function ---
  const handleLogout = () => {
    localStorage.removeItem("jwt_token"); // Remove the stored JWT token
    // Optionally, you might clear other user-specific states if they're not reset by redirection
    setStudentData(null);
    setUploadedProjects([]);
    alert("You have been logged out."); // Inform the user
    navigate("/student-signin"); // Redirect to the sign-in page
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-xl font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  // Fallback if studentData is null after loading (shouldn't happen with error handling)
  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">No student data found. Please log in.</p>
      </div>
    );
  }

  // Destructure student data for easier access
  const { name, email, github, linkedin, skills, profile_image_url } = studentData;

  const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Student"
  )}&background=0D8ABC&color=fff&size=128`;

  return (
    <Sidebar>
      <div className="flex">
        {/* Sidebar Links */}
        <SidebarBody>
          <div className="flex flex-col gap-2 mt-10 px-4">
            {sidebarLinks.map((link, index) => (
              <SidebarLink key={index} link={link} onClick={link.onClick} />
            ))}
            {/* --- NEW: Logout Link in Sidebar --- */}
            <SidebarLink
              link={{ name: "Logout", href: "#" }} // Use a dummy href
              onClick={handleLogout}
              className="mt-4 text-red-500 hover:text-red-700 font-semibold" // Added some styling for emphasis
            />
          </div>
        </SidebarBody>

        {/* Main Content with background */}
        <main className="flex-1 p-6 min-h-screen relative">
          {/* 🌌 Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
            style={{ backgroundImage: `url(${nasaBackground})` }}
          />

          {/* Optional dark overlay for better readability */}
          <div className="absolute inset-0 bg-black opacity-30 z-0" />

          {/* Foreground Content */}
          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Profile Section */}
            <div className="flex items-center gap-6 mb-8">
              <div className="text-center">
                <label className="cursor-pointer block">
                  <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shadow-md hover:opacity-80">
                    <img
                      src={profile_image_url || avatarURL} // Use profile_image_url from backend if exists
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <a
                  href={profile_image_url || avatarURL}
                  download="ProfilePicture.jpg"
                  className="text-sm text-blue-600 underline mt-1 inline-block"
                >
                  Download Profile Picture
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={name || ""} // Use name from fetched data
                  readOnly
                  className="text-xl font-bold bg-transparent border-b border-gray-400 outline-none cursor-not-allowed text-white"
                />
                <input
                  type="email"
                  value={email || ""} // Use email from fetched data
                  readOnly
                  className="text-sm text-gray-300 bg-transparent border-b border-gray-300 outline-none cursor-not-allowed"
                />
              </div>

              <button
                onClick={() => navigate("upload")}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload New Project
              </button>
            </div>

            {/* Uploaded Projects */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Uploaded Projects</h3>
              {uploadedProjects.length > 0 ? ( // Use uploadedProjects from state
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uploadedProjects.map((project) => ( // Map through fetched projects
                    <div key={project.id} className="p-4 bg-white shadow-md rounded-xl">
                      <h4 className="text-lg font-bold">{project.title}</h4>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      {/* You might want to add links/buttons to view/edit project */}
                      {project.status && (
                        <p className={`text-xs mt-2 font-semibold ${
                            project.status === "Approved" ? "text-green-600" :
                            project.status === "Pending" ? "text-yellow-600" :
                            "text-red-600"
                        }`}>
                            Status: {project.status}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-100">No projects uploaded yet.</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-2 text-white">My Skills</h3>
              {studentData.skills && studentData.skills.length > 0 ? ( // Use studentData.skills
                <div className="flex flex-wrap gap-2">
                  {studentData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-100">No skills added yet. Add some on your profile.</p>
              )}
            </div>

            {/* Nested Outlet for sub-routes like /dashboard/projects, /dashboard/profile */}
            <div className="mt-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </Sidebar>
  );
};

export default StudentDashboard;