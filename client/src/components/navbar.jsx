// import React, { useRef, useState } from "react";
// import {
//   IconBrandGithub,
//   IconBrandX,
//   IconExchange,
//   IconHome,
//   IconNewSection,
//   IconTerminal2,
//   IconLayoutNavbarCollapse,
// } from "@tabler/icons-react";
// import {
//   AnimatePresence,
//   motion,
//   useMotionValue,
//   useSpring,
//   useTransform,
// } from "motion/react";

// // Utility class merging
// const cn = (...classes) => classes.filter(Boolean).join(" ");

// export default function FloatingDockDemo() {
//   const links = [
//     {
//       title: "Home",
//       icon: (
//         <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
//       ),
//       href: "#",
//     },
//     {
//       title: "Products",
//       icon: (
//         <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
//       ),
//       href: "#",
//     },
//     {
//       title: "Components",
//       icon: (
//         <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
//       ),
//       href: "#",
//     },
//     {
//       title: "Aceternity UI",
//       icon: (
//         <img
//           src="https://assets.aceternity.com/logo-dark.png"
//           width={20}
//           height={20}
//           alt="Aceternity Logo"
//         />
//       ),
//       href: "#",
//     },
//     {
//       title: "Changelog",
//       icon: (
//         <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
//       ),
//       href: "#",
//     },
//     {
//       title: "Twitter",
//       icon: (
//         <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
//       ),
//       href: "#",
//     },
//     {
//       title: "GitHub",
//       icon: (
//         <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
//       ),
//       href: "#",
//     },
//   ];

//   return (
//     <div className="w-screen h-screen">
//       <FloatingDock mobileClassName="translate-y-20" items={links} />
//     </div>
//   );
// }

// const FloatingDock = ({ items, desktopClassName, mobileClassName }) => (
//   <>
//     <FloatingDockDesktop items={items} className={desktopClassName} />
//     <FloatingDockMobile items={items} className={mobileClassName} />
//   </>
// );

// // ✅ VERTICAL FLOATING DOCK FOR DESKTOP
// const FloatingDockDesktop = ({ items, className }) => {
//   const mouseY = useMotionValue(Infinity);

//   return (
//     <motion.div
//       onMouseMove={(e) => mouseY.set(e.clientY)}
//       onMouseLeave={() => mouseY.set(Infinity)}
//       className={cn(
//         "fixed left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-neutral-900",
//         className
//       )}
//     >
//       {items.map((item) => (
//         <IconContainerVertical mouseY={mouseY} key={item.title} {...item} />
//       ))}
//     </motion.div>
//   );
// };

// // ✅ ICON CONTAINER FOR VERTICAL DESKTOP
// function IconContainerVertical({ mouseY, title, icon, href }) {
//   const ref = useRef(null);

//   const distance = useTransform(mouseY, (val) => {
//     const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
//     return val - bounds.y - bounds.height / 2;
//   });

//   const size = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
//   const iconSize = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

//   const width = useSpring(size, { mass: 0.1, stiffness: 150, damping: 12 });
//   const height = useSpring(size, { mass: 0.1, stiffness: 150, damping: 12 });
//   const widthIcon = useSpring(iconSize, {
//     mass: 0.1,
//     stiffness: 150,
//     damping: 12,
//   });
//   const heightIcon = useSpring(iconSize, {
//     mass: 0.1,
//     stiffness: 150,
//     damping: 12,
//   });

//   const [hovered, setHovered] = useState(false);

//   return (
//     <a href={href}>
//       <motion.div
//         ref={ref}
//         style={{ width, height }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800"
//       >
//         <AnimatePresence>
//           {hovered && (
//             <motion.div
//               initial={{ opacity: 0, x: 10, y: "-50%" }}
//               animate={{ opacity: 1, x: 0, y: "-50%" }}
//               exit={{ opacity: 0, x: 10, y: "-50%" }}
//               className="absolute left-full ml-2 top-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
//             >
//               {title}
//             </motion.div>
//           )}
//         </AnimatePresence>
//         <motion.div
//           style={{ width: widthIcon, height: heightIcon }}
//           className="flex items-center justify-center"
//         >
//           {icon}
//         </motion.div>
//       </motion.div>
//     </a>
//   );
// }

// // ✅ EXISTING FLOATING DOCK FOR MOBILE (UNCHANGED)
// const FloatingDockMobile = ({ items, className }) => {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className={cn("relative block md:hidden", className)}>
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             layoutId="nav"
//             className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
//           >
//             {items.map((item, idx) => (
//               <motion.div
//                 key={item.title}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{
//                   opacity: 0,
//                   y: 10,
//                   transition: { delay: idx * 0.05 },
//                 }}
//                 transition={{ delay: (items.length - 1 - idx) * 0.05 }}
//               >
//                 <a
//                   href={item.href}
//                   className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900"
//                 >
//                   <div className="h-4 w-4">{item.icon}</div>
//                 </a>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
//       >
//         <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
//       </button>
//     </div>
//   );
// }



import React from 'react'

const Navbar = () => {
  return (
    <div className='bg-orange-400'>
     <h1>Navbar</h1> 
    </div>
  )
}

export default Navbar
