"use client";

import { motion } from "framer-motion";

export function PagePreloader() {
  // Futuristic orbiting particles
  const particles = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50 pointer-events-none">
      <div className="relative w-24 h-24">
        {/* Central core */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-xl"
        />

        {/* Orbiting particles */}
        {particles.map((i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.1,
            }}
            className="absolute inset-0"
            style={{
              perspective: "1000px",
            }}
          >
            <div
              className="absolute w-2 h-2 rounded-full bg-primary"
              style={{
                top: "50%",
                left: "50%",
                transform: `translateX(-50%) translateY(-50%) rotate(${
                  i * 60
                }deg) translateY(-40px)`,
              }}
            />
          </motion.div>
        ))}

        {/* Pulsing rings */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-primary"
        />

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 rounded-full border border-primary/50"
        />

        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-purple-600 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Loading text */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-12 text-xs text-muted-foreground tracking-widest uppercase"
      >
        Loading
      </motion.div>
    </div>
  );
}

export function usePagePreloader() {
  // Dummy hook for future use with page transitions
  return null;
}
