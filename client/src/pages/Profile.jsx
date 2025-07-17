import React, { useEffect, useState } from "react";
import nasa2 from "../assets/nasa2.jpg"; // ✅ Import the image

const Profile = () => {
  const [name, setName] = useState("Ken Tuei");
  const [email, setEmail] = useState("tueituei@example.com");
  const [github, setGithub] = useState("https://github.com/Kentuei");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/kentuei");

  const [skills, setSkills] = useState(() => {
    const stored = localStorage.getItem("studentSkills");
    return stored ? JSON.parse(stored) : ["React", "Node.js", "PostgreSQL", "Tailwind CSS"];
  });
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("studentData"));
    if (saved) {
      setName(saved.name);
      setEmail(saved.email);
      setGithub(saved.github);
      setLinkedin(saved.linkedin);
    }
  }, []);

  const handleSave = () => {
    const studentData = { name, email, github, linkedin };
    localStorage.setItem("studentData", JSON.stringify(studentData));
    alert("Profile saved!");
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">GitHub:</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">LinkedIn:</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
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

export default Profile;
