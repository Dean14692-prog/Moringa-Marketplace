"use client";
import React from "react";
import { Link } from "react-router-dom";
import { Vortex } from "../components/ui/vortex";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";

export function HerosSection() {
  const words = [
    {
      text: "Launch Ideas Inspire Innovations.",
      className: "text-white",
    },
  ];  

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <TypewriterEffectSmooth words={words} speed={5} />

        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Welcome to a digital launchpad where Moringa students turn final
          projects into real-world impact.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link to="/projects">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
              View now
            </button>
          </Link>
        </div>
      </Vortex>
    </div>
  );
}
