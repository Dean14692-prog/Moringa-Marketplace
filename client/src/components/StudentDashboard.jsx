// src/pages/StudentDashboard.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import { sidebarLinks } from "../constants/sidebarLinks";
import { Outlet, useNavigate } from "react-router-dom";
import nasaBackground from "../assets /nasa.jpg";

// --- MOCK DATA ---
const mockStudentData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  github: "https://github.com/johndoe",
  linkedin: "https://www.linkedin.com/in/johndoe",
  skills: ["React", "Python", "Flask", "Tailwind CSS", "SQL"],
  profile_image_url: "https://via.placeholder.com/128/0D8ABC/FFFFFF?text=JD",
};

const mockProjects = [
  {
    id: 101,
    title: "Moringa Market Web App",
    description: "A full-stack e-commerce platform for student projects.",
    status: "Approved",
    github_link: "https://github.com/johndoe/marketplace",
    demo_link: "https://marketplace.vercel.app",
    file_url: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Project1",
    category: "Web Development",
  },
  {
    id: 102,
    title: "AI Chatbot for Customer Support",
    description: "An intelligent chatbot integrated with customer service.",
    status: "Pending",
    github_link: "https://github.com/johndoe/ai-chatbot",
    demo_link: "https://chatbot-demo.netlify.app",
    file_url: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Project2",
    category: "Artificial Intelligence",
  },
  {
    id: 103,
    title: "Mobile Fitness Tracker",
    description: "An Android application to track workouts and nutrition.",
    status: "Rejected",
    github_link: "https://github.com/johndoe/fitness-app",
    demo_link: null,
    file_url: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Project3",
    category: "Mobile Development",
  },
];

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [uploadedProjects, setUploadedProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Directly load mock data
    setStudentData(mockStudentData);
    setUploadedProjects(mockProjects);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentData((prev) => ({
        ...prev,
        profile_image_url: URL.createObjectURL(file),
      }));
    }
  };

  const handleLogout = () => {
    setStudentData(null);
    setUploadedProjects([]);
    alert("You have been logged out.");
    navigate("/student-signin");
  };

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">
          No student data found. Please log in.
        </p>
        <button
          onClick={() => navigate("/student-signin")}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const { name, email, github, linkedin, skills, profile_image_url } =
    studentData;

  const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Student"
  )}&background=0D8ABC&color=fff&size=128`;

  return (
    <Sidebar>
      <div className="flex">
        <SidebarBody>
          <div className="flex flex-col gap-2 mt-10 px-4">
            {sidebarLinks.map((link, index) => (
              <SidebarLink key={index} link={link} />
            ))}
            <SidebarLink
              link={{ name: "Logout", href: "#" }}
              onClick={handleLogout}
              className="mt-4 text-red-500 hover:text-red-700 font-semibold"
            />
          </div>
        </SidebarBody>

        <main className="flex-1 p-6 min-h-screen relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
            style={{ backgroundImage: `url(${nasaBackground})` }}
          />
          <div className="absolute inset-0 bg-black opacity-30 z-0" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-6 mb-8 bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-sm">
              <div className="text-center">
                <label className="cursor-pointer block">
                  <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shadow-md hover:opacity-80 border-2 border-blue-400">
                    <img
                      src={profile_image_url || avatarURL}
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
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white">{name}</h2>
                <p className="text-lg text-gray-300">{email}</p>
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    GitHub: {github.split("/").pop()}
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    LinkedIn: {linkedin.split("/").pop()}
                  </a>
                )}
              </div>

              <button
                onClick={() => navigate("upload")}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Upload New Project
              </button>
            </div>

            <div className="mt-8 bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Your Projects
              </h3>
              {uploadedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uploadedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 bg-white/20 shadow-md rounded-xl backdrop-blur-sm text-white"
                    >
                      <h4 className="text-lg font-bold">{project.title}</h4>
                      <p className="text-sm text-gray-200 mt-1">
                        {project.description}
                      </p>
                      {project.status && (
                        <p
                          className={`text-xs mt-2 font-semibold ${
                            project.status === "Approved"
                              ? "text-green-400"
                              : project.status === "Pending"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          Status: {project.status}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-100">
                  You haven't uploaded any projects yet. Click "Upload New
                  Project" to get started!
                </p>
              )}
            </div>

            <div className="mt-8 bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-2 text-white">
                My Skills
              </h3>
              {skills && skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-100">
                  No skills added yet. Update your profile to add some!
                </p>
              )}
            </div>

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
