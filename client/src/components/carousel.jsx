import React, { useRef } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

const style = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-x: hidden;
  }
`;

export default function Carousel() {
  const scrollRef = useRef(null);
  const scrollAmount = 300;

  const data = [
    {

      category: "T- Shirt",
      title: "Branded T-Shirt",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-w4xPOgS05_VO4weMI62UTjooqhEuORSeYQ&s",
    },
    {
      category: "Books",
      title: "NoteBook",
      src: "https://riogiftshop.com/wp-content/uploads/2023/10/Customized-Notebooks-in-Kenya.jpg",
    },
    {
      category: "Product",
      title: "Launching the new Apple Vision Pro.",
      src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop",
    },
    {
      category: "Product",
      title: "Maps for your iPhone 15 Pro Max.",
      src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop",
    },
    {
      category: "iOS",
      title: "Photography just got better.",
      src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop",
    },
    {
      category: "Hiring",
      title: "Hiring for a Staff Software Engineer",
      src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop",
    },
  ];

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <>
      {/* Inject scrollbar-hiding styles */}
      <style>{style}</style>

      <div className="relative w-full h-screen bg-gray-100 py-12 px-6 overflow-hidden">
        <h2 className="text-center text-3xl font-bold mb-6">Featured Projects</h2>

        {/* Left Arrow */}
        <button
          onClick={handleScrollLeft}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <IconArrowNarrowLeft size={24} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleScrollRight}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <IconArrowNarrowRight size={24} />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-8 hide-scrollbar"
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="min-w-[320px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-100 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-blue-600 text-sm">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
