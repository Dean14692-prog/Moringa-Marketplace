import React, { useEffect, useState } from "react";

const Profile = () => {
  const [skills, setSkills] = useState(() => {
    const stored = localStorage.getItem("studentSkills");
    return stored ? JSON.parse(stored) : ["React", "Node.js", "PostgreSQL", "Tailwind CSS"];
  });

  const [skillInput, setSkillInput] = useState("");

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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="space-y-4">
        <p><strong>Name:</strong> Ken Tuei</p>
        <p><strong>Email:</strong> tueituei@example.com</p>
        <p><strong>Role:</strong> Student</p>
        <p>
          <strong>GitHub:</strong>{" "}
          <a href="https://github.com/Kentuei" target="_blank" className="text-blue-600 underline">
            https://github.com/Kentuei
          </a>
        </p>
        <p>
          <strong>LinkedIn:</strong>{" "}
          <a href="https://linkedin.com/in/kentuei" target="_blank" className="text-blue-600 underline">
            https://linkedin.com/in/kentuei
          </a>
        </p>

        {/* Editable Skills Section */}
        <div>
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

          <ul className="list-disc list-inside mt-2 text-sm text-gray-700 flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <li key={index} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-red-500 font-bold">×</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
