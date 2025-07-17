import { useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedTestimonials() {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sam Tomashi",
      designation: "Product Manager at TechFlow",
      //   src:"../"
      src: "data:image/jpeg;base64,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",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Rose Momanyi",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Shamim ",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Ken Tuei",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "Aaron Rashid",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Elvis Otieno",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop",
    },
  ];

  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => index === active;

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  return (
    <div className="w-screen h-screen bg-[#deeaee] text-black font-sans">
      <div className="max-w-7xl mx-auto h-full px-4 py-16 flex items-center">
        <div>
          <h1 className=" space-y-20 text-3xl lg:text-4xl font-bold text-black font-sans">
            Testimonials
          </h1>
        </div>
        <div></div>
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2 w-full">
          <div className="relative h-80 w-80 ml-30">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    className="h-full w-full rounded-3xl object-cover object-center"
                    draggable={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Right: Text Content */}
          <div className="flex flex-col justify-between py-4 mr-30">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <h3 className="text-2xl font-bold">
                {testimonials[active].name}
              </h3>
              <p className="text-sm text-gray-700">
                {testimonials[active].designation}
              </p>
              <motion.p className="mt-8 text-lg text-gray-900">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>

            {/* Arrows */}
            <div className="flex gap-4 pt-12 md:pt-0">
              <button
                onClick={handlePrev}
                className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <IconArrowLeft className="h-5 w-5 text-black group-hover/button:rotate-12 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <IconArrowRight className="h-5 w-5 text-black group-hover/button:-rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
