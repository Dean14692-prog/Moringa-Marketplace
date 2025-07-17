// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import nasa2 from "../assets/nasa2.jpg"; // Import the image

const Profile = () => {
  // State to hold the entire student object fetched from the backend
  const [student, setStudent] = useState({
    name: "",
    email: "",
    github: "",
    linkedin: "",
    skills: [], // Initialize as an empty array
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for initial fetch and saves
  const [error, setError] = useState(null); // Error state for API calls

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Helper function to get the JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("jwt_token");
  };

  // --- Effect Hook for Initial Data Fetch ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        // If no token, redirect to login page
        navigate("/student-signin");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT for authentication
          },
        });

        if (!response.ok) {
          // Handle specific errors like 401 Unauthorized (invalid/expired token)
          if (response.status === 401) {
            localStorage.removeItem("jwt_token"); // Clear invalid token
            navigate("/student-signin");
            alert("Your session has expired. Please sign in again.");
          }
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const data = await response.json();
        // Update the student state with fetched data
        setStudent({
          id: data.id, // Keep the ID if you need it for future specific operations
          name: data.name || "",
          email: data.email || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          skills: data.skills || [], // Ensure skills is an array, even if null from backend
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProfile();
  }, [navigate]); // Dependency array: Re-run effect if 'navigate' function changes (rare)

  // --- Handler for input field changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  // --- Handler for saving profile changes to the backend ---
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      navigate("/student-signin");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/me", {
        method: "PATCH", // Use PATCH method for partial updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT for authentication
        },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
          github: student.github,
          linkedin: student.linkedin,
          skills: student.skills, // Send the current skills array to the backend
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("jwt_token");
          navigate("/student-signin");
          alert("Your session has expired. Please sign in again.");
        }
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const updatedData = await response.json();
      // Update local state with the data returned from the backend to ensure consistency
      setStudent({
        id: updatedData.id,
        name: updatedData.name || "",
        email: updatedData.email || "",
        github: updatedData.github || "",
        linkedin: updatedData.linkedin || "",
        skills: updatedData.skills || [],
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // --- Handler for adding a skill ---
  const addSkill = async () => {
    const newSkill = skillInput.trim();
    if (newSkill && !student.skills.includes(newSkill)) {
      const updatedSkills = [...student.skills, newSkill];
      // Update local state first for immediate UI feedback
      setStudent((prev) => ({ ...prev, skills: updatedSkills }));
      setSkillInput(""); // Clear input field

      // Automatically trigger save to backend after local state update
      // It's crucial that handleSave uses the LATEST state (which it does via closure or by accessing `student`)
      await handleSave();
    }
  };

  // --- Handler for removing a skill ---
  const removeSkill = async (skillToRemove) => {
    const updatedSkills = student.skills.filter((s) => s !== skillToRemove);
    // Update local state first
    setStudent((prev) => ({ ...prev, skills: updatedSkills }));

    // Automatically trigger save to backend
    await handleSave();
  };

  // --- Render Loading and Error States ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading profile...</p>
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
        style={{ backgroundImage: `url(${nasa2})` }}
      />
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-0" />

      {/* Profile Content */}
      <div className="relative z-10 max-w-3xl mx-auto bg-white/90 p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>

        <div className="space-y-4">
          {/* Editable Fields */}
          <div>
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              name="name" // Added name attribute for consistency
              value={student.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              name="email" // Added name attribute
              value={student.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">GitHub:</label>
            <input
              type="url"
              name="github" // Added name attribute
              value={student.github}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">LinkedIn:</label>
            <input
              type="url"
              name="linkedin" // Added name attribute
              value={student.linkedin}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Role is read-only as per backend model */}
          <div>
            <label className="block font-semibold">Role:</label>
            <input
              type="text"
              name="role"
              value={student.role || "student"} // Display role, default if not set
              readOnly
              className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
            />
          </div>


          <button
            onClick={handleSave}
            disabled={loading} // Disable button while loading
            className={`bg-blue-600 text-white px-4 py-2 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {/* Editable Skills Section */}
          <div className="mt-6">
            <strong>Skills:</strong>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                className="border p-2 rounded flex-1"
              />
              <button
                onClick={addSkill}
                disabled={loading} // Disable button while loading
                className={`bg-blue-600 text-white px-4 py-2 rounded transition ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>

            <ul className="list-none mt-2 text-sm text-gray-700 flex flex-wrap gap-2">
              {student.skills && student.skills.length > 0 ? ( // Check if student.skills exists and has length
                student.skills.map((skill, index) => (
                  <li
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      disabled={loading} // Disable button while loading
                      className={`text-red-500 font-bold ml-1 transition ${
                        loading ? "opacity-50 cursor-not-allowed" : "hover:text-red-700"
                      }`}
                    >
                      ×
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;