import React, { useRef } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

const style = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function Carousel() {
  const scrollRef = useRef(null);
  const scrollAmount = 400;

  const data = [
    {
      category: "Software Engineering",
      title: "Build scalable software solutions.",
      src: "https://picsum.photos/400/500?random=1",
    },
    {
      category: "Data Science",
      title: "Data-driven decisions with insights.",
      src: "https://picsum.photos/400/500?random=2",
    },
    {
      category: "Artificial Intelligence",
      title: "AI is shaping the future.",
      src: "https://picsum.photos/400/500?random=3",
    },
    {
      category: "Cyber Security",
      title: "Protect your digital world.",
      src: "https://picsum.photos/400/500?random=4",
    },
    {
      category: "Product Design",
      title: "Design meets innovation.",
      src: "https://picsum.photos/400/500?random=5",
    },
    {
      category: "Software Engineering",
      title: "Join the engineering revolution.",
      src: "https://picsum.photos/400/500?random=6",
    },
  ];

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <>
      <style>{style}</style>

      <div className="relative w-full min-h-screen bg-neutral-900 py-12 px-6 overflow-hidden">
        <h2 className="text-center text-4xl font-bold text-white mb-12">
          Explore Career Tracks
        </h2>

        {/* Arrows */}
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md"
        >
          <IconArrowNarrowLeft size={24} className="text-black" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md"
        >
          <IconArrowNarrowRight size={24} className="text-black" />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-4 hide-scrollbar"
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="w-[360px] h-[460px] flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden shadow-xl relative"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-end">
                <h1 className="text-lg text-white font-bold ">
                  {item.category}
                </h1>
                <p className="text-xs text-white tracking-widest mb-1 font-medium">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
