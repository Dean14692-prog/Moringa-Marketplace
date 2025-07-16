import { useState } from "react";
import { HeartIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import ContactCard from "./ContactCard";

const statusClasses = {
  Approved: { bg: "bg-green-100", text: "text-green-800" },
  Pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  Rejected: { bg: "bg-red-100", text: "text-red-800" },
};

const ProjectCard = ({ project }) => {
  const {
    title,
    category,
    status = "Pending",
    image,
    githubLink,
    student = {},
  } = project;

  const { bg, text } = statusClasses[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
  };

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showContact, setShowContact] = useState(false); // Modal state

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-4 border hover:border-amber-400 transition flex flex-col">
      {/* Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded mb-4"
        />
      )}

      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600 mb-1">{category}</p>
      <span className={`text-xs inline-block px-2 py-1 rounded ${bg} ${text}`}>
        {status}
      </span>

      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          View on GitHub →
        </a>
      )}

      {status === "Approved" && (
        <>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${
                liked ? "text-red-500" : "text-gray-600"
              } hover:text-red-600`}
            >
              <HeartIcon
                className={`w-5 h-5 ${
                  liked ? "fill-red-500" : "fill-none stroke-red-500"
                }`}
              />
              {likes} {likes === 1 ? "Like" : "Likes"}
            </button>

            {student?.email && (
              <button
                onClick={() => setShowContact(true)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <EnvelopeIcon className="w-5 h-5" />
                Contact
              </button>
            )}
          </div>

          {/* ContactCard in Modal */}
          {showContact && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
              <div className="bg-white p-6 rounded shadow-xl max-w-md w-full relative">
                <button
                  onClick={() => setShowContact(false)}
                  className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
                >
                  &times;
                </button>
                <ContactCard student={student} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectCard;

// Bckend requments 
// {
//   "title": "AI Chatbot",
//   "category": "AI/ML",
//   "status": "Approved",
//   "image": "/uploads/chatbot.png",
//   "githubLink": "https://github.com/you/chatbot",
//   "student": {
//     "name": "Faith Wanjiku",
//     "email": "faith@example.com",
//     "phone": "+254712345678",
//     "linkedin": "https://linkedin.com/in/faith",
//     "github": "https://github.com/faith",
//     "website": "https://faith.dev"
//   }
// }
