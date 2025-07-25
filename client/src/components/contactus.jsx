"use client";
import React from "react";
import { AnimatedTooltip } from "../components/ui/animated-tooltip";
import { motion } from "framer-motion";
import AnimatedStats from "./animatednumbers";

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3534&q=80",
  },
];

export function AnimatedTooltipPreview() {
  return (
    <>
      <div className="w-screen py-12 px-6 flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* About Us Section */}
        <div className="max-w-xl flex flex-col items-center text-center space-y-4">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1, color: "#4f46e5", y: -5 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
          >
            About Us
          </motion.h2>

          <motion.p
            className="text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            We are a passionate team of designers, engineers, and creators
            working together to deliver innovative solutions. Our goal is to
            combine creativity with technology to build exceptional user
            experiences.
          </motion.p>
        </div>

        {/* Animated Tooltip Section */}
        <div className="flex justify-center">
          <AnimatedTooltip items={people} />
        </div>
      </div>
      <AnimatedStats />
    </>
  );

}
