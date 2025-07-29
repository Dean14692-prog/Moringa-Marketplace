import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="w-screen bg-gray-900 text-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <Link to="/" className="flex flex-col items-start group">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-300 font-calligraphy relative z-10">
                  Innovation
                </span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-400 font-calligraphy -mt-2 relative z-10">
                  Marketplace
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/home"
                className="text-white/90 hover:text-orange-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 transform hover:scale-110"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="text-white/90 hover:text-orange-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 transform hover:scale-110"
              >
                Projects
              </Link>
              <Link
                to="/shop"
                className="text-white/90 hover:text-orange-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 transform hover:scale-110"
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="text-white/90 hover:text-orange-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 transform hover:scale-110"
              >
                Contact Us
              </Link>
            </div>

            {/* Right: Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/signup"
                className="flex items-center space-x-2 text-white/90 hover:text-white px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-600/10 hover:bg-orange-500/20 transition-all duration-300 hover:shadow-md hover:shadow-orange-500/20 transform hover:scale-110"
              >
                <User size={16} className="text-orange-300" />
                <span>Sign Up</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-110 hover:brightness-110"
              >
                <LogIn size={16} className="text-white" />
                <span>Log In</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/home"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                onClick={toggleMenu}
              >
                Projects
              </Link>
              <Link
                to="/shop"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                onClick={toggleMenu}
              >
                Contact Us
              </Link>
              <div className="pt-4 border-t border-gray-700">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 mb-2"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-4 py-2 border border-orange-500 rounded-md shadow-sm text-base font-medium text-orange-300 bg-orange-500/10 hover:bg-orange-500/20"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
