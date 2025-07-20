"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../components/ui/use-outside-click";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const bgImage =
  "https://plus.unsplash.com/premium_photo-1681400019731-5d7cc4cafb9d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function MyProjects() {
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

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Home</span>
      </Link>
      {/* Overlay */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Active Card Modal */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-2 right-2 lg:hidden bg-white rounded-full h-6 w-6 flex items-center justify-center"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
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
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
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
                    className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
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

      {/* List of Cards */}
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
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
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
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
          </motion.div>
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
      <p>
        Lana Del Rey is celebrated for her melancholic, cinematic style. Her
        songs explore tragic romance, glamour, and introspection with haunting
        vocals.
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
      <p>
        Babbu Maan is known for emotional lyrics and Punjabi cultural themes,
        connecting deeply with fans through storytelling and soulful music.
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
      <p>
        Metallica, pioneers of thrash metal, combine aggressive rhythms and
        complex themes, making them one of the most influential metal bands.
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
      <p>
        Led Zeppelin revolutionized rock with their blend of blues, folk, and
        hard rock, becoming icons of the 1970s music scene.
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
      <p>
        "Toh Phir Aao" from Awarapan captures emotional depth and longing with
        soulful vocals and powerful cinematic moments.
      </p>
    ),
  },
];
