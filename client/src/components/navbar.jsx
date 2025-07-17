import React from "react";
import { Search, User, LogIn } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MyApp</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-all duration-200"
              >
                Home
              </a>

              {/* About Us Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-all duration-200">
                  About Us
                </button>

                {/* Dropdown Card */}
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About Our Company
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We're a team of passionate developers and designers
                      creating amazing digital experiences.
                    </p>
                    <div className="space-y-2">
                      <a
                        href="#"
                        className="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-all duration-200"
                      >
                        Our Story
                      </a>
                      <a
                        href="#"
                        className="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-all duration-200"
                      >
                        Team Members
                      </a>
                      <a
                        href="#"
                        className="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-all duration-200"
                      >
                        Careers
                      </a>
                      <a
                        href="#"
                        className="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-all duration-200"
                      >
                        Mission & Values
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Us Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-all duration-200">
                  Contact Us
                </button>

                {/* Dropdown Card */}
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Get In Touch
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We'd love to hear from you. Choose how you'd like to
                      connect with us.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            📧
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email
                          </p>
                          <p className="text-sm text-gray-600">
                            group1@gmail.com
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-medium">
                            📱
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Phone
                          </p>
                          <p className="text-sm text-gray-600">
                            +254767890987{" "}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 hover:shadow-md transform hover:scale-105 transition-all duration-200">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Search and Auth */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 w-64"
                />
              </div>

              {/* Sign In Button */}
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-all duration-200 transform hover:scale-105">
                <User size={16} />
                <span>Sign In</span>
              </button>

              {/* Log In Button */}
              <button className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 hover:shadow-md transform hover:scale-105 transition-all duration-200">
                <LogIn size={16} />
                <span>Log In</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
