import React, { useState } from "react";
import nasa2 from "../assets /nasa2.jpg";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";


// UI components
const LabelInputContainer = ({ children, className }) => (
  <div className={`flex flex-col ${className}`}>{children}</div>
);


const Profile = () => {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    github: "",
    linkedin: "",
    role: "student",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      alert("Profile updated successfully (local only).");
      setLoading(false);
    }, 1000);
  };

  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (newSkill && !student.skills.includes(newSkill)) {
      setStudent((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setSkillInput("");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: `url(${nasa2})` }}
      />
      <div className="absolute inset-0 bg-black opacity-50 z-0" />

      {/* Main content */}
      <div className="bg-zinc-800/60 relative z-10 w-full max-w-6xl flex flex-col md:flex-row gap-8 p-8 rounded-xl shadow-2xl backdrop-blur">
        {/* Left column - form */}
        <div className="flex-1 text-white">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>

          <div className="space-y-4">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name" className="text-sm text-white text-left">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
                value={student.name}
                onChange={handleChange}
                className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="email" className="text-sm text-white text-left">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={student.email}
                onChange={handleChange}
                className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="github" className="text-sm text-white text-left">
                GitHub Profile
              </Label>
              <Input
                id="github"
                name="github"
                type="url"
                placeholder="https://github.com/your-username"
                value={student.github}
                onChange={handleChange}
                className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label
                htmlFor="linkedin"
                className="text-sm text-white text-left"
              >
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/your-name"
                value={student.linkedin}
                onChange={handleChange}
                className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
              />
            </LabelInputContainer>

            <button
              onClick={handleSave}
              disabled={loading}
              className={`bg-blue-600 text-white px-4 py-2 rounded w-full mt-4 transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            {/* Skills input */}
            <div className="mt-6">
              <LabelInputContainer>
                <Label className="text-sm text-white text-left mb-2">
                  Add Skill
                </Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Enter a skill"
                    className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3 flex-1"
                  />
                  <button
                    onClick={addSkill}
                    disabled={loading}
                    className={`bg-blue-600 text-white px-4 py-2 rounded transition ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "Adding..." : "Add"}
                  </button>
                </div>
              </LabelInputContainer>
            </div>
          </div>
        </div>

        {/* Right column - preview card */}
        <div
          className="flex-1 rounded-lg shadow-xl p-6 border border-gray-300 text-white relative bg-cover bg-center backdrop-blur-md"
          style={{ backgroundImage: `url(${nasa2})` }}
        >
          {/* Optional dark overlay for readability */}
          <div className="absolute inset-0 bg-black/60 rounded-lg z-0" />

          {/* Main content over the background */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">
              Saved Info
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {student.name || "-"}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {student.email || "-"}
              </p>
              <p>
                <span className="font-semibold">GitHub:</span>{" "}
                {student.github || "-"}
              </p>
              <p>
                <span className="font-semibold">LinkedIn:</span>{" "}
                {student.linkedin || "-"}
              </p>

            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2 text-white">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {student.skills.length > 0 ? (
                  student.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-200/80 text-blue-900 px-3 py-1 rounded-full text-sm font-medium shadow"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-300 text-sm">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
