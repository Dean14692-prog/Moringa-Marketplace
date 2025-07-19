import { useState } from "react";
import { Search, Bell, MessageCircle, User, Home } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading] = useState(false);

  const projects = [
    {
      id: 1,
      image: "https://picsum.photos/300/400?random=1",
      title: "Beautiful Mountain Landscape",
      description:
        "Breathtaking view of snow-capped mountains during golden hour. Perfect for nature lovers and hiking enthusiasts.",
      price: "KSh 3,249",
    },
    {
      id: 2,
      image: "https://picsum.photos/300/600?random=2",
      title: "Modern Architecture Design",
      description:
        "Contemporary building design with clean lines and geometric patterns. Ideal for architectural inspiration.",
      price: "KSh 11,699",
    },
    {
      id: 3,
      image: "https://picsum.photos/300/350?random=3",
      title: "Gourmet Food Photography",
      description:
        "Delicious culinary masterpiece captured in stunning detail. Perfect for food bloggers and restaurants.",
      price: "KSh 2,079",
    },
    {
      id: 4,
      image: "https://picsum.photos/300/450?random=4",
      title: "Urban Street Art",
      description:
        "Colorful graffiti on city walls showcasing modern street culture and artistic expression.",
      price: "KSh 1,499",
    },
    {
      id: 5,
      image: "https://picsum.photos/300/500?random=5",
      title: "Tech Gadgets Showcase",
      description:
        "High-tech gadgets including smartphones, drones, and smartwatches. For the tech-savvy crowd.",
      price: "KSh 18,999",
    },
    {
      id: 6,
      image: "https://picsum.photos/300/300?random=6",
      title: "Cultural Festival Parade",
      description:
        "Vibrant costumes and traditional dances captured during a lively cultural festival.",
      price: "KSh 4,200",
    },
    {
      id: 7,
      image: "https://picsum.photos/300/400?random=7",
      title: "Vintage Car Exhibition",
      description:
        "Classic cars on display at an outdoor exhibition. A treat for automotive enthusiasts.",
      price: "KSh 7,450",
    },
    {
      id: 8,
      image: "https://picsum.photos/300/600?random=8",
      title: "Sunset Over the Ocean",
      description:
        "Romantic and serene view of the sun setting over calm ocean waves.",
      price: "KSh 2,800",
    },
    {
      id: 9,
      image: "https://picsum.photos/300/450?random=9",
      title: "Tropical Beach Paradise",
      description:
        "White sandy beaches and crystal-clear waters perfect for vacation inspiration.",
      price: "KSh 3,999",
    },
    {
      id: 10,
      image: "https://picsum.photos/300/500?random=10",
      title: "Abstract Digital Art",
      description:
        "Futuristic abstract compositions blending colors and shapes. Ideal for digital art lovers.",
      price: "KSh 6,750",
    },
    {
      id: 11,
      image: "https://picsum.photos/300/350?random=11",
      title: "Pet Portrait",
      description:
        "Adorable photo of a playful dog in natural light. Great for animal lovers.",
      price: "KSh 1,990",
    },
    {
      id: 12,
      image: "https://picsum.photos/300/400?random=12",
      title: "Modern Furniture Design",
      description:
        "Stylish and minimalist furniture pieces for modern interiors and design ideas.",
      price: "KSh 13,999",
    },
    {
      id: 13,
      image: "https://picsum.photos/300/600?random=13",
      title: "Astronomy Night Sky",
      description:
        "Star trails and galaxy views captured in long-exposure photography.",
      price: "KSh 9,350",
    },
    {
      id: 14,
      image: "https://picsum.photos/300/500?random=14",
      title: "Urban Cityscape",
      description:
        "Aerial view of a bustling city full of lights and skyscrapers.",
      price: "KSh 8,100",
    },
    {
      id: 15,
      image: "https://picsum.photos/300/300?random=15",
      title: "Street Food Market",
      description:
        "Delicious street food from across cultures served in a vibrant outdoor market.",
      price: "KSh 2,550",
    },
    {
      id: 16,
      image: "https://picsum.photos/300/400?random=16",
      title: "Sports Action Shot",
      description:
        "High-intensity sports moment captured in perfect motion. Great for activewear ads.",
      price: "KSh 4,999",
    },
    {
      id: 17,
      image: "https://picsum.photos/300/350?random=17",
      title: "Rustic Farm Landscape",
      description:
        "Rolling hills, barns, and farmland under golden sunlight. Perfect for rural charm.",
      price: "KSh 3,100",
    },
    {
      id: 18,
      image: "https://picsum.photos/300/550?random=18",
      title: "Portrait in Studio",
      description:
        "Professional studio lighting and portrait photography techniques displayed beautifully.",
      price: "KSh 5,899",
    },
    {
      id: 19,
      image: "https://picsum.photos/300/500?random=19",
      title: "Yoga at Sunrise",
      description:
        "Peaceful morning yoga session by the lake. Great for wellness and lifestyle brands.",
      price: "KSh 3,300",
    },
    {
      id: 20,
      image: "https://picsum.photos/300/600?random=20",
      title: "Coding Workspace",
      description:
        "Minimalist programmer workspace with code on screen and ambient lighting.",
      price: "KSh 12,250",
    },
    {
      id: 21,
      image: "https://picsum.photos/300/400?random=21",
      title: "Coffee Flatlay",
      description: "Aesthetic overhead shot of coffee, books, and cozy vibes.",
      price: "KSh 1,299",
    },
    {
      id: 22,
      image: "https://picsum.photos/300/550?random=22",
      title: "Creative Agency Team",
      description:
        "Modern workspace filled with a young creative team brainstorming ideas.",
      price: "KSh 15,499",
    },
    {
      id: 23,
      image: "https://picsum.photos/300/450?random=23",
      title: "Fashion Editorial",
      description:
        "Stylish model in bold clothing for an outdoor fashion magazine shoot.",
      price: "KSh 8,699",
    },
    {
      id: 24,
      image: "https://picsum.photos/300/500?random=24",
      title: "Wildlife Safari",
      description:
        "Close-up of a lion resting in the savannah. Ideal for wildlife tourism.",
      price: "KSh 7,300",
    },
    {
      id: 25,
      image: "https://picsum.photos/300/600?random=25",
      title: "Winter Wonderland",
      description: "Snow-covered trees and cabins under a soft winter sky.",
      price: "KSh 5,400",
    },
    {
      id: 26,
      image: "https://picsum.photos/300/400?random=26",
      title: "Fitness Gym Routine",
      description: "Sweaty gym session showing strength and determination.",
      price: "KSh 4,999",
    },
    {
      id: 27,
      image: "https://picsum.photos/300/500?random=27",
      title: "Wedding Photography",
      description:
        "Emotional moment captured during a couple's big day. Perfect for wedding portfolios.",
      price: "KSh 14,999",
    },
    {
      id: 28,
      image: "https://picsum.photos/300/450?random=28",
      title: "Travel Essentials Pack",
      description:
        "Flatlay of items packed for travel adventures. Great for travel bloggers.",
      price: "KSh 2,899",
    },
    {
      id: 29,
      image: "https://picsum.photos/300/550?random=29",
      title: "Handmade Crafts",
      description:
        "Close-up of artisans working on handcrafted jewelry and decor.",
      price: "KSh 6,599",
    },
    {
      id: 30,
      image: "https://picsum.photos/300/400?random=30",
      title: "Aerial Drone Shot",
      description:
        "Stunning bird’s-eye view of natural landscapes using drone photography.",
      price: "KSh 10,500",
    },
  ];

  const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div
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

              <div className="mt-4">
                <button className="cursor-pointer rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800 hover:bg-zinc-700 transition">
                  <span>Cost</span>
                  <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                    {project.price}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-50 bg-black border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Home size={20} className="text-gray-700" />
              </Link>
            </nav>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 hover:bg-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-full border-none outline-none transition-all duration-200 text-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} className="text-gray-700" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle size={20} className="text-gray-700" />
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-gray-200 transition-all">
              <User size={16} className="text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-0 bg-black">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectLayout;
