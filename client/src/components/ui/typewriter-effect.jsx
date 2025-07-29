// "use client";

// import { cn } from "@/lib/utils";
// import { motion, stagger, useAnimate, useInView } from "motion/react";
// import { useEffect } from "react";

// export const TypewriterEffect = ({ words, className, cursorClassName }) => {
//   // split text inside of words into array of characters
//   const wordsArray = words.map((word) => {
//     return {
//       ...word,
//       text: word.text.split(""),
//     };
//   });

//   const [scope, animate] = useAnimate();
//   const isInView = useInView(scope);
//   useEffect(() => {
//     if (isInView) {
//       animate(
//         "span",
//         {
//           display: "inline-block",
//           opacity: 1,
//           width: "fit-content",
//         },
//         {
//           duration: 0.3,
//           delay: stagger(0.1),
//           ease: "easeInOut",
//         }
//       );
//     }
//   }, [isInView]);

//   const renderWords = () => {
//     return (
//       <motion.div ref={scope} className="inline">
//         {wordsArray.map((word, idx) => {
//           return (
//             <div key={`word-${idx}`} className="inline-block">
//               {word.text.map((char, index) => (
//                 <motion.span
//                   initial={{}}
//                   key={`char-${index}`}
//                   className={cn(
//                     `dark:text-white text-black opacity-0 hidden`,
//                     word.className
//                   )}
//                 >
//                   {char}
//                 </motion.span>
//               ))}
//             </div>
//           );
//         })}
//       </motion.div>
//     );
//   };
//   return (
//     <div
//       className={cn(
//         "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
//         className
//       )}
//     >
//       {renderWords()}
//       <motion.span
//         initial={{
//           opacity: 0,
//         }}
//         animate={{
//           opacity: 1,
//         }}
//         transition={{
//           duration: 0.8,
//           repeat: Infinity,
//           repeatType: "reverse",
//         }}
//         className={cn(
//           "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
//           cursorClassName
//         )}
//       ></motion.span>
//     </div>
//   );
// };

// export const TypewriterEffectSmooth = ({
//   words,
//   className,
//   cursorClassName,
// }) => {
//   // split text inside of words into array of characters
//   const wordsArray = words.map((word) => ({
//     ...word,
//     text: word.text.split(""),
//   }));

//   const containerRef = React.useRef(null);
//   const [isVisible, setIsVisible] = React.useState(false);

//   React.useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.unobserve(entry.target);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (containerRef.current) {
//       observer.observe(containerRef.current);
//     }

//     return () => {
//       if (containerRef.current) {
//         observer.unobserve(containerRef.current);
//       }
//     };
//   }, []);

//   const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
//   const [displayedWords, setDisplayedWords] = React.useState([]);

//   React.useEffect(() => {
//     if (!isVisible) return;

//     if (currentWordIndex < wordsArray.length) {
//       const timer = setTimeout(() => {
//         setDisplayedWords(prev => [...prev, wordsArray[currentWordIndex]]);
//         setCurrentWordIndex(prev => prev + 1);
//       }, currentWordIndex === 0 ? 300 : 1000); // Faster first word, then 1s delay between words

//       return () => clearTimeout(timer);
//     }
//   }, [currentWordIndex, isVisible, wordsArray.length]);

//   const renderWords = () => {
//     return (
//       <div className="inline-flex flex-wrap items-center justify-center gap-x-2">
//         {displayedWords.map((word, wordIdx) => (
//           <motion.div 
//             key={`word-${wordIdx}`} 
//             className="inline-block"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{
//               duration: 0.5,
//               ease: [0.4, 0, 0.2, 1],
//               delay: wordIdx * 0.2
//             }}
//           >
//             <span
//               className={cn(
//                 'inline-block',
//                 word.className || 'dark:text-white text-black',
//                 'transition-all duration-500',
//                 word.text === '🚀' ? 'text-5xl md:text-7xl transform hover:rotate-12 hover:scale-110' : ''
//               )}
//             >
//               {word.text}
//             </span>
//           </motion.div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div 
//       ref={containerRef}
//       className={cn("relative w-full flex items-center justify-center py-4", className)}
//     >
//       <div className="relative inline-flex items-center">
//         {renderWords()}
//         {isVisible && (
//           <motion.span
//             initial={{ opacity: 0 }}
//             animate={{ 
//               opacity: [0, 1, 1, 0],
//               scale: [1, 1.1, 0.9, 1]
//             }}
//             transition={{
//               duration: 1.2,
//               repeat: Infinity,
//               repeatType: "loop",
//               times: [0, 0.1, 0.9, 1],
//               ease: "easeInOut"
//             }}
//             className={cn(
//               "inline-block ml-1 rounded-full w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600",
//               cursorClassName
//             )}
//           />
//         )}
//       </div>
//     </div>
//   );
// };


"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";

export const TypewriterEffect = ({ words, className, cursorClassName }) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView, animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  key={`char-${index}`}
                  className={cn(
                    `dark:text-white text-black opacity-0 hidden`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              {/* FIX: Add a space between words */}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      />
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseBetween = 1000,
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState(words[0]);

  // Handle intersection observer for when component comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Handle the typing and deleting effect
  useEffect(() => {
    if (!isVisible) return;
    
    const currentWordText = words[currentWordIndex].text;
    
    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseBetween);
      return () => clearTimeout(timer);
    }

    if (isDeleting) {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(timeout);
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsDeleting(false);
        setCurrentWord(words[(currentWordIndex + 1) % words.length]);
      }
    } else {
      if (currentText.length < currentWordText.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWordText.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        setIsPaused(true);
      }
    }
  }, [currentText, isVisible, currentWordIndex, isDeleting, isPaused, words, typingSpeed, deletingSpeed, pauseBetween]);

  const renderWords = () => {
    return (
      <div className="inline-flex items-center justify-center min-h-[4rem] md:min-h-[5rem]">
        <motion.span
          key={`word-${currentWordIndex}`}
          className={cn(
            'inline-block text-4xl md:text-6xl font-bold',
            currentWord.className || 'dark:text-white text-black',
            'transition-all duration-200',
            currentWord.text === '🚀' ? 'text-5xl md:text-7xl transform hover:rotate-12 hover:scale-110' : ''
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
        >
          {currentText}
        </motion.span>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full flex items-center justify-center py-4", className)}
    >
      <div className="relative inline-flex items-center">
        {renderWords()}
        {isVisible && !isPaused && (
          <motion.span
            key="cursor"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.1, 0.9, 1],
              ease: "easeInOut",
            }}
            className={cn(
              "inline-block w-[3px] h-10 rounded-sm ml-1",
              "bg-gradient-to-b from-orange-400 to-orange-600",
              cursorClassName
            )}
            style={{
              boxShadow: '0 0 8px rgba(251, 146, 60, 0.5)'
            }}
          />
        )}
      </div>
    </div>
  );
};