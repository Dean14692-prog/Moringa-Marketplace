import React, { useEffect, useState } from "react";
import nasa3 from "../assets/nasa3.jpg"; // ✅ Import background image

const Projects = () => {
  const [student, setStudent] = useState({
    name: "Ken Tuei",
    email: "tueituei@example.com",
    role: "Student",
    github: "https://github.com/Kentuei",
    linkedin: "https://linkedin.com/in/kentuei",
  });

  const [skills, setSkills] = useState(() => {
    const stored = localStorage.getItem("studentSkills");
    return stored ? JSON.parse(stored) : ["React", "Node.js", "PostgreSQL", "Tailwind CSS"];
  });

  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/students/${student.id || 1}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (newSkill && !skills.includes(newSkill)) {
      const updated = [...skills, newSkill];
      setSkills(updated);
      localStorage.setItem("studentSkills", JSON.stringify(updated));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    localStorage.setItem("studentSkills", JSON.stringify(updated));
  };

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
        <h1 className="text-2xl font-bold mb-6">My Projects</h1>

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
              readOnly
              className="bg-gray-100 border px-3 py-2 w-full rounded"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
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
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>

            <ul className="list-none mt-2 text-sm text-gray-700 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
