import { useState } from "react";
import { Search, Bell, MessageCircle, User, Home, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";

const categories = ["All", "Landscape", "Design", "Art", "Tech"];

const ProjectLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const projects = [
    {
      id: 1,
      image: "https://picsum.photos/300/400?random=1",
      title: "Beautiful Mountain Landscape",
      description:
        "Breathtaking view of snow-capped mountains during golden hour.",
      category: "Landscape",
      developer: {
        name: "Rose Momanyi",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ8i8lVWP53CDVy_3uh21rk9qKhx4XdPR3nQ&s",
        bio: "Full Stack Developer passionate about turning ideas into reality. Specializing in React, Flask, and user experience.",
      },
    },
    {
      id: 2,
      image: "https://picsum.photos/300/600?random=2",
      title: "Modern Architecture Design",
      description: "Contemporary building design with clean lines.",
      category: "Design",
      developer: {
        name: "Dennis Ngui",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        bio: "Frontend Developer with a focus on clean, modern UI and smooth user interactions. Skilled in Tailwind and React.",
      },
    },
    {
      id: 3,
      image: "https://picsum.photos/300/500?random=3",
      title: "Creative Tech Art",
      description: "Fusion of art and technology in digital painting.",
      category: "Tech",
      developer: {
        name: "Mary Atieno",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        bio: "UX Designer and creative coder, bringing artistic flair to tech projects using Figma and Webflow.",
      },
    },
    {
      id: 4,
      image: "https://picsum.photos/300/420?random=4",
      title: "Night Sky Photography",
      description:
        "A clear view of the Milky Way captured from a remote desert.",
      category: "Photography",
      developer: {
        name: "James Mwangi",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        bio: "Back End Developer with a knack for APIs and performance optimization. Works with Django and PostgreSQL.",
      },
    },
    {
      id: 5,
      image: "https://picsum.photos/300/450?random=5",
      title: "Retro 8-bit Game",
      description: "An indie platformer built with love and pixel art.",
      category: "Games",
      developer: {
        name: "Linda Wanjiku",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        bio: "Game Developer and pixel artist blending fun and code using Phaser and Unity.",
      },
    },
    {
      id: 6,
      image: "https://picsum.photos/300/410?random=6",
      title: "Smart Home Dashboard",
      description: "Control your smart devices from one sleek interface.",
      category: "IoT",
      developer: {
        name: "Brian Otieno",
        image: "https://randomuser.me/api/portraits/men/6.jpg",
        bio: "IoT enthusiast and developer passionate about automation, MQTT, and real-time control systems.",
      },
    },
    {
      id: 7,
      image: "https://picsum.photos/300/600?random=7",
      title: "Fashion E-Commerce UI",
      description: "Mobile-first interface for a fashion retail startup.",
      category: "UI/UX",
      developer: {
        name: "Agnes Nyambura",
        image: "https://randomuser.me/api/portraits/women/7.jpg",
        bio: "UI/UX Designer focused on mobile experiences and design systems. Loves working with Figma and Tailwind.",
      },
    },
    {
      id: 8,
      image: "https://picsum.photos/300/500?random=8",
      title: "Finance Tracker App",
      description: "A simple app to track expenses and savings goals.",
      category: "Finance",
      developer: {
        name: "Samuel Kibe",
        image: "https://randomuser.me/api/portraits/men/8.jpg",
        bio: "React Native Developer passionate about building mobile-first fintech apps.",
      },
    },
    {
      id: 9,
      image: "https://picsum.photos/300/450?random=9",
      title: "AI Chatbot Assistant",
      description: "Conversational bot for customer support using NLP.",
      category: "AI",
      developer: {
        name: "Cynthia Wambui",
        image: "https://randomuser.me/api/portraits/women/9.jpg",
        bio: "Machine Learning engineer using Python and TensorFlow to build smarter assistants.",
      },
    },
    {
      id: 10,
      image: "https://picsum.photos/300/480?random=10",
      title: "Plant Identifier",
      description: "App that uses image recognition to identify plants.",
      category: "Education",
      developer: {
        name: "Elijah Kariuki",
        image: "https://randomuser.me/api/portraits/men/10.jpg",
        bio: "Full Stack Developer working with Flask, React, and machine vision for educational apps.",
      },
    },
  ];
  

  const filteredProjects = projects
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(
      (p) => selectedCategory === "All" || p.category === selectedCategory
    )
    .slice(0, visibleCount);

  const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div
        onClick={() => setSelectedProject(project)}
        className="break-inside-avoid mb-4 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
          <div className="relative overflow-hidden rounded-t-2xl">
            {!imageLoaded && (
              <div className="bg-gray-200 animate-pulse aspect-[3/4]" />
            )}
            <img
              src={project.image}
              alt={project.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full object-cover transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-95 rounded-lg" : ""}`}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${
              isHovered ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="p-4 bg-white">
              <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
                {project.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="p-3 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Home size={20} />
            </Link>
          </nav>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-full border-none outline-none text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 hover:bg-gray-700 rounded-full">
              <Bell size={20} />
            </button>
            <button className="p-3 hover:bg-gray-700 rounded-full">
              <MessageCircle size={20} />
            </button>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      {/* Category Buttons */}
      <div className="flex justify-center gap-3 flex-wrap mb-6 mt-6 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setVisibleCount(8);
            }}
            className={`px-4 py-2 rounded-full border transition text-sm ${
              selectedCategory === cat
                ? "bg-white text-black border-white"
                : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {filteredProjects.length === 0 ? (
            <p className="text-center col-span-full py-10">
              No projects found.
            </p>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>

        {filteredProjects.length <
          projects.filter(
            (p) =>
              p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (selectedCategory === "All" || p.category === selectedCategory)
          ).length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      <Dialog
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex items-start justify-center"
      >
        {selectedProject && (
          <Dialog.Panel className="w-full h-full overflow-auto bg-white relative">
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-gray-700 hover:text-red-500 z-50"
              onClick={() => setSelectedProject(null)}
            >
              <X size={24} />
            </button>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-4 px-6 py-10 md:gap-6 md:px-16 md:py-12 mt-15">
              {/* Left: Project Info */}
              <div className="ml-20 w-full md:w-2/4">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="rounded-xl mb-4 w-full max-h-[300px] object-cover shadow"
                />
                <h2 className="text-3xl font-bold mb-2">
                  {selectedProject.title}
                </h2>
                <p className="text-gray-700 mb-3">
                  {selectedProject.description}
                </p>
                <p className="text-sm text-gray-500">
                  Category: {selectedProject.category}
                </p>
              </div>

              {/* Right: Developer Info */}
              <div className="w-full md:w-1/3 flex flex-col items-center text-center bg-gray-50 p-4 rounded-xl shadow-md">
                <img
                  src={selectedProject.developer.image}
                  alt={selectedProject.developer.name}
                  className="w-24 h-24 rounded-full mb-3 object-cover border-4 border-white shadow"
                />
                <h3 className="text-xl font-semibold mb-1">
                  {selectedProject.developer.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {selectedProject.developer.bio}
                </p>
                <Link to="/contact-me">
                  <button className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    Contact Me
                  </button>
                </Link>
              </div>
            </div>
          </Dialog.Panel>
        )}
      </Dialog>
    </div>
  );
};

export default ProjectLayout;
