"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../components/ui/use-outside-click";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyProjects({ limit }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActive(null);
    };

    if (active) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const displayedCards = limit
    ? [...cards].reverse().slice(0, limit)
    : [...cards].reverse();

  return (
    <div className="divide-y divide-gray-200">
      <Link
        to="/dashboard"
        className="absolute top-4 left-4 flex items-center gap-2 text-sm text-black px-2 py-1 rounded hover:bg-zinc-200 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Home</span>
      </Link>

      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-2 right-2 lg:hidden bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center shadow"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4 mt-15">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-black"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-black"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>

                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-black text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ul className="max-w-2xl mx-auto w-full divide-y divide-gray-300">
        {displayedCards.map((card) => (
          <motion.li
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row mt-2">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-black text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-black text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>

            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

// Card Data
const cards = [
  {
    title: "Summertime Sadness",
    description: "Lana Del Rey",
    src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        Lana Del Rey is celebrated for her melancholic style.
      </p>
    ),
  },
  {
    title: "Mitran Di Chhatri",
    description: "Babbu Maan",
    src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        Babbu Maan is known for emotional Punjabi lyrics.
      </p>
    ),
  },
  {
    title: "For Whom The Bell Tolls",
    description: "Metallica",
    src: "https://assets.aceternity.com/demos/metallica.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        Metallica pioneers thrash metal and aggressive rhythms.
      </p>
    ),
  },
  {
    title: "Stairway To Heaven",
    description: "Led Zeppelin",
    src: "https://assets.aceternity.com/demos/led-zeppelin.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        Led Zeppelin blended blues, folk, and hard rock.
      </p>
    ),
  },
  {
    title: "Toh Phir Aao",
    description: "Mustafa Zahid",
    src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
    ctaText: "View",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => (
      <p className="text-black">
        "Toh Phir Aao" captures longing and emotion powerfully.
      </p>
    ),
  },
];
