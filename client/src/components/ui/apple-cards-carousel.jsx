// "use client";
// import React, {
//   useEffect,
//   useRef,
//   useState,
//   createContext,
//   useContext,
// } from "react";
// import {
//   IconArrowNarrowLeft,
//   IconArrowNarrowRight,
//   IconX,
// } from "@tabler/icons-react";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "motion/react";
// import { useOutsideClick } from "../ui/use-outside-click";

// export const CarouselContext = createContext({
//   onCardClose: () => {},
//   currentIndex: 0,
// });

// export default function ProjectDisplay({ items, initialScroll = 0 }) {
//   const carouselRef = React.useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = React.useState(false);
//   const [canScrollRight, setCanScrollRight] = React.useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollLeft = initialScroll;
//       checkScrollability();
//     }
//   }, [initialScroll]);

//   const checkScrollability = () => {
//     if (carouselRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
//       setCanScrollLeft(scrollLeft > 0);
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
//     }
//   };

//   const scrollLeft = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
//     }
//   };

//   const handleCardClose = (index) => {
//     if (carouselRef.current) {
//       const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
//       const gap = isMobile() ? 4 : 8;
//       const scrollPosition = (cardWidth + gap) * (index + 1);
//       carouselRef.current.scrollTo({
//         left: scrollPosition,
//         behavior: "smooth",
//       });
//       setCurrentIndex(index);
//     }
//   };

//   const isMobile = () => {
//     return window && window.innerWidth < 768;
//   };

//   return (
//     <CarouselContext.Provider
//       value={{ onCardClose: handleCardClose, currentIndex }}
//     >
//       <div className="relative w-full">
//         <div
//           className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
//           ref={carouselRef}
//           onScroll={checkScrollability}
//         >
//           <div
//             className={cn(
//               "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"
//             )}
//           ></div>

//           <div
//             className={cn(
//               "flex flex-row justify-start gap-4 pl-4",
//               "mx-auto max-w-7xl"
//             )}
//           >
//             {items.map((item, index) => (
//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   y: 20,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                   transition: {
//                     duration: 0.5,
//                     delay: 0.2 * index,
//                     ease: "easeOut",
//                     once: true,
//                   },
//                 }}
//                 key={"card" + index}
//                 className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
//               >
//                 {item}
//               </motion.div>
//             ))}
//           </div>
//         </div>
//         <div className="mr-10 flex justify-end gap-2">
//           <button
//             className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
//             onClick={scrollLeft}
//             disabled={!canScrollLeft}
//           >
//             <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
//           </button>
//           <button
//             className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
//             onClick={scrollRight}
//             disabled={!canScrollRight}
//           >
//             <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
//           </button>
//         </div>
//       </div>
//     </CarouselContext.Provider>
//   );
// }
