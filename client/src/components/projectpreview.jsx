"use client";

import React from "react";
import { motion } from "framer-motion";

// Utility for combining class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function BackgroundGradientDemo() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black px-4 py-10 w-screen">
      {/* Title */}
      <h2 className="text-white text-3xl font-bold mb-10 text-center">
        Merchandise
      </h2>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl">
        {cardData.map((card, index) => (
          <BackgroundGradient
            key={index}
            className="text-white h-full"
            containerClassName="w-[300px] h-[500px]"
          >
            <div className="rounded-[20px] bg-zinc-900 p-6 sm:p-6 flex flex-col h-full">
              <img
                src={card.image}
                alt={card.title}
                className="object-contain w-100 h-100 mb-4"
              />

              {/* Push content to bottom */}
              <div className="flex-grow" />

              <div className="space-y-1">
                <p className="text-lg font-semibold">{card.title}</p>
                <p className="text-sm text-neutral-400 line-clamp-3">
                  {card.description}
                </p>
              </div>

              <div className="mt-4">
                <button className="cursor-pointer rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800 hover:bg-zinc-700 transition">
                  <span>Buy now</span>
                  <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                    {card.price}
                  </span>
                </button>
              </div>
            </div>
          </BackgroundGradient>
        ))}
      </div>

      {/* View More Button */}
      <button className="mt-10 rounded-full bg-white text-black font-semibold px-6 py-2 hover:bg-neutral-200 transition">
        View More
      </button>
    </div>
  );
}


const cardData = [
  {
    title: "Air Jordan 4 Retro",
    description:
      "The AJ4 Retro Reimagined Bred will release on Feb 17, 2024. Best chance is to enter raffles.",
    price: "$100",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-w4xPOgS05_VO4weMI62UTjooqhEuORSeYQ&s",
  },
  {
    title: "Nike Dunk Low Panda",
    description:
      "Timeless black and white Dunk Low that pairs with any outfit. Regular restocks.",
    price: "$90",
    image:
      "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/e6ce2731-5c77-4877-8484-917e27647c38/dunk-low-mens-shoes-bCzchX.png",
  },
  {
    title: "Yeezy Slide Pure",
    description:
      "Minimalist Yeezy comfort. Lightweight, stylish, and iconic—perfect for everyday wear.",
    price: "$80",
    image:
      "https://sneakernews.com/wp-content/uploads/2022/03/adidas-yeezy-slide-pure-2022-release-date.jpg",
  },
];

// Border Gradient Component
export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  const variants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
  };

  return (
    <div
      className={cn(
        "relative group rounded-[24px] p-[2px]",
        containerClassName
      )}
    >
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ backgroundSize: "400% 400%" }}
        className={cn(
          "absolute inset-0 z-0 rounded-[24px]",
          "bg-[conic-gradient(from_0deg,#00ccb1,#7b61ff,#ffc414,#1ca0fb,#00ccb1)]",
          "transition duration-500 group-hover:blur-sm"
        )}
      />
      <div className="relative z-10 rounded-[22px] bg-black p-[2px] h-full">
        <div className={cn("rounded-[20px] h-full", className)}>{children}</div>
      </div>
    </div>
  );
};
