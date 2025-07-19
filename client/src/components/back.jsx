import React from "react";
import { Vortex } from "../components/ui/vortex";

export function HerosSection() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <h3 className="text-white text-xl md:text-6xl font-bold text-center">
          Launch Ideas Inspire Innovation
        </h3>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Welcome to a digital launchpad where Moringa students turn final projects into
          real-world impact.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            View now
          </button>
        </div>
      </Vortex>
    </div>
  );
}
