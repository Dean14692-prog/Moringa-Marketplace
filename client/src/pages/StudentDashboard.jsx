// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Sidebar,
//   SidebarBody,
//   SidebarLink,
// } from "../components/Sidebar";
// import { sidebarLinks } from "../constants/sidebarLinks";
// import { Outlet, useNavigate } from "react-router-dom";

// const StudentDashboard = () => {
//   const [profileImage, setProfileImage] = useState(null);
//   const [name, setName] = useState("Ken Tuei");
//   const [email, setEmail] = useState("tueituei@example.com");
//   const [skills, setSkills] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedSkills = localStorage.getItem("studentSkills");
//     if (storedSkills) {
//       setSkills(JSON.parse(storedSkills));
//     }

//     const studentData = JSON.parse(localStorage.getItem("studentData"));
//     if (studentData) {
//       setName(studentData.name);
//       setEmail(studentData.email);
//     }
//   }, []);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileImage(URL.createObjectURL(file));
//     }
//   };

//   const dummyProjects = [
//     {
//       title: "AI-Powered Tutor",
//       description: "A smart tutoring system that adapts to student needs.",
//     },
//     {
//       title: "EcoMarket",
//       description: "A platform to buy and sell eco-friendly products.",
//     },
//   ];

//   const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`;

//   return (
//     <Sidebar>
//       <div className="flex">
//         {/* Sidebar Links */}
//         <SidebarBody>
//           <div className="flex flex-col gap-2 mt-10 px-4">
//             {sidebarLinks.map((link, index) => (
//               <SidebarLink key={index} link={link} onClick={link.onClick} />
//             ))}
//           </div>
//         </SidebarBody>

//         {/* Main Content */}
//         <main className="flex-1 p-6 bg-blue-100 min-h-screen">
//           <div className="max-w-5xl mx-auto">
//             {/* Profile Section */}
//             <div className="flex items-center gap-6 mb-8">
//               <div className="text-center">
//                 <label className="cursor-pointer block">
//                   <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shadow-md hover:opacity-80">
//                     <img
//                       src={profileImage || avatarURL}
//                       alt="Profile"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                   />
//                 </label>
//                 <a
//                   href={profileImage || avatarURL}
//                   download="ProfilePicture.jpg"
//                   className="text-sm text-blue-600 underline mt-1 inline-block"
//                 >
//                   Download Profile Picture
//                 </a>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <input
//                   type="text"
//                   value={name}
//                   readOnly
//                   className="text-xl font-bold bg-transparent border-b border-gray-400 outline-none cursor-not-allowed"
//                 />
//                 <input
//                   type="email"
//                   value={email}
//                   readOnly
//                   className="text-sm text-gray-600 bg-transparent border-b border-gray-300 outline-none cursor-not-allowed"
//                 />
//               </div>

//               <button
//                 onClick={() => navigate("upload")}
//                 className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Upload New Project
//               </button>
//             </div>

//             {/* Uploaded Projects */}
//             <div>
//               <h3 className="text-2xl font-semibold mb-4">Uploaded Projects</h3>
//               {dummyProjects.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {dummyProjects.map((project, index) => (
//                     <div key={index} className="p-4 bg-white shadow-md rounded-xl">
//                       <h4 className="text-lg font-bold">{project.title}</h4>
//                       <p className="text-sm text-gray-600">{project.description}</p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-600">No projects uploaded yet.</p>
//               )}
//             </div>

//             {/* Skills Section */}
//             <div className="mt-10">
//               <h3 className="text-2xl font-semibold mb-2">My Skills</h3>
//               {skills.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {skills.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-600">No skills added yet. Add some on your profile.</p>
//               )}
//             </div>

//             {/* Nested Outlet */}
//             <div className="mt-10">
//               <Outlet />
//             </div>
//           </div>
//         </main>
//       </div>
//     </Sidebar>
//   );
// };

// export default StudentDashboard;
"use client";

import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../components/Sidebar";
import { sidebarLinks } from "../constants/sidebarLinks";
import { Outlet, useNavigate } from "react-router-dom";

// ✅ Import background image
import nasaBackground from "../assets/nasa.jpg";

const StudentDashboard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("Ken Tuei");
  const [email, setEmail] = useState("tueituei@example.com");
  const [skills, setSkills] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedSkills = localStorage.getItem("studentSkills");
    if (storedSkills) {
      setSkills(JSON.parse(storedSkills));
    }

    const studentData = JSON.parse(localStorage.getItem("studentData"));
    if (studentData) {
      setName(studentData.name);
      setEmail(studentData.email);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const dummyProjects = [
    {
      title: "AI-Powered Tutor",
      description: "A smart tutoring system that adapts to student needs.",
    },
    {
      title: "EcoMarket",
      description: "A platform to buy and sell eco-friendly products.",
    },
  ];

  const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
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
                      src={profileImage || avatarURL}
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
                  href={profileImage || avatarURL}
                  download="ProfilePicture.jpg"
                  className="text-sm text-blue-600 underline mt-1 inline-block"
                >
                  Download Profile Picture
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={name}
                  readOnly
                  className="text-xl font-bold bg-transparent border-b border-gray-400 outline-none cursor-not-allowed text-white"
                />
                <input
                  type="email"
                  value={email}
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
              {dummyProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dummyProjects.map((project, index) => (
                    <div key={index} className="p-4 bg-white shadow-md rounded-xl">
                      <h4 className="text-lg font-bold">{project.title}</h4>
                      <p className="text-sm text-gray-600">{project.description}</p>
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
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
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

            {/* Nested Outlet */}
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
