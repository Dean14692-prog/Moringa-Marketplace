// src/pages/Projects.jsx (Consider renaming this file to Profile.jsx for clarity)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import nasa3 from "../assets/nasa3.jpg"; // Background image

const Projects = () => { // Again, consider renaming this component to 'Profile'
  const [student, setStudent] = useState({ // Holds current student data from backend
    name: "",
    email: "",
    role: "",
    github: "",
    linkedin: "",
    skills: [], // Now an array from the backend
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);   // Error state

  const navigate = useNavigate();

  // Helper function to get the JWT token
  const getAuthToken = () => {
    return localStorage.getItem("jwt_token");
  };

  useEffect(() => {
    const fetchStudentProfile = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        // No token found, redirect to login
        navigate("/student-signin");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If 401 Unauthorized, token is invalid/expired
          if (response.status === 401) {
            localStorage.removeItem("jwt_token"); // Clear invalid token
            navigate("/student-signin");
            alert("Your session has expired. Please sign in again.");
          }
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const data = await response.json();
        // Update state with fetched data
        setStudent({
          id: data.id, // Keep the ID for PATCH requests if needed
          name: data.name,
          email: data.email,
          role: data.role || "student", // Default role if not provided
          github: data.github || "",
          linkedin: data.linkedin || "",
          skills: data.skills || [], // Ensure skills is an array
        });
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [navigate]); // Dependency array: re-run if navigate changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
  };

  const handleSaveProfile = async () => {
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
        method: "PATCH", // Use PATCH for partial updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
          github: student.github,
          linkedin: student.linkedin,
          skills: student.skills, // Send skills array to backend
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
      setStudent(updatedData); // Update state with the confirmed data from backend
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    const newSkill = skillInput.trim();
    if (newSkill && !student.skills.includes(newSkill)) {
      const updatedSkills = [...student.skills, newSkill];
      setStudent((prev) => ({ ...prev, skills: updatedSkills }));
      setSkillInput("");
      // Immediately try to save the updated skills to backend
      // We pass the new list of skills explicitly to handleSaveProfile
      // This pattern is better than calling handleSaveProfile directly after state update if handleSaveProfile relies on current state for other fields.
      // Alternatively, make addSkill and removeSkill directly trigger the PATCH request for just skills.
      await handleSaveProfile(); // This will save all current student state
    }
  };

  const removeSkill = async (skillToRemove) => {
    const updatedSkills = student.skills.filter((s) => s !== skillToRemove);
    setStudent((prev) => ({ ...prev, skills: updatedSkills }));
    // Immediately try to save the updated skills to backend
    await handleSaveProfile(); // This will save all current student state
  };

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
        style={{ backgroundImage: `url(${nasa3})` }}
      />
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-0" />

      {/* Content Card */}
      <div className="relative z-10 max-w-3xl mx-auto bg-white/90 p-6 rounded shadow-md mt-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1> {/* Changed title */}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">GitHub</label>
            <input
              type="url"
              name="github"
              value={student.github}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={student.linkedin}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <input
              type="text"
              name="role"
              value={student.role}
              readOnly // Role should typically not be editable by the user
              className="bg-gray-100 border px-3 py-2 w-full rounded cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700 transition"
          >
            Save Profile
          </button>

          {/* Skills Section */}
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>

            <ul className="list-none mt-2 text-sm text-gray-700 flex flex-wrap gap-2">
              {student.skills.length > 0 ? (
                student.skills.map((skill, index) => (
                  <li
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-red-500 font-bold ml-1 hover:text-red-700"
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

export default Projects; // Remember to rename the file to Profile.jsx