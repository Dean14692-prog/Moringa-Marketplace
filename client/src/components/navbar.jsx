import React from "react";
import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-screen bg-gray-900 text-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo + Links */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-white">
                Marketplace
              </Link>

              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md transition-all duration-200"
              >
                Home
              </Link>

              <Link
                to="/contact"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md transition-all duration-200"
              >
                Contact Us
              </Link>
              <Link
                to="/shop"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md transition-all duration-200"
              >
                Merchants
              </Link>
              <Link
                to="/projects"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md transition-all duration-200"
              >
                Projects
              </Link>
            </div>
            {/* <div className="mt-4 flex space-x-3"></div> */}

            {/* Right: Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/signup"
                className="flex items-center space-x-1 text-white hover:text-blue-300 px-3 py-2 rounded-md transition-all duration-200 transform hover:scale-105"
              >
                <User size={16} />
                <span>Sign Up</span>
              </Link>

              <Link
                to="/login"
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 hover:shadow-md transform hover:scale-105 transition-all duration-200"
              >
                <LogIn size={16} />
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
