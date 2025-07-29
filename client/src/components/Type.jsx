"use client";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    { text: "🚀" },
    { 
      text: "Launch",
      className: "text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
    },
    { 
      text: "Your",
      className: "text-4xl md:text-6xl font-bold text-orange-400"
    },
    { 
      text: "Next",
      className: "text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700"
    },
    {
      text: "Marketplace",
      className: "text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        <TypewriterEffectSmooth 
          words={words} 
          className="text-center w-full"
          cursorClassName="h-10 w-2 bg-orange-500"
        />
      </div>
      <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
        Connect with innovators, showcase your projects, and find your next opportunity
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-orange-200 dark:shadow-orange-900/50">
          Explore Projects
        </button>
        <button className="px-6 py-3 rounded-full bg-white text-orange-500 font-medium border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105">
          Sign Up Free
        </button>
      </div>
    </div>
  );
}
