"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = [
  "INITIALIZING...",
  "LOADING CORE...",
  "BYPASSING SEC...",
  "ESTABLISHING LINK...",
  "ALIAS // GEN READY",
];

export function PagePreloader() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= WORDS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setShow(false), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center font-mono"
    >
      <div className="w-64">
        <div className="flex justify-between items-end mb-2 text-xs text-primary/70">
          <span>SYS.BOOT.V2</span>
          <span>{Math.min((index + 1) * 20, 100)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((index + 1) * 20, 100)}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="h-full bg-primary"
          />
        </div>

        {/* Scramble Text */}
        <div className="mt-4 h-8 flex items-center text-sm font-bold tracking-widest text-primary">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {`> ${WORDS[index]}`}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,28,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </motion.div>
  );
}

export function usePagePreloader() {
  return null;
}
