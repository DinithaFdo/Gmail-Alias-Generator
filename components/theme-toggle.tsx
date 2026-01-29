"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { saveTheme, loadTheme } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  // Separate hydration logic
  useEffect(() => {
    setMounted(true);
  }, []);

  // DOM manipulation only - no state updates
  const updateThemeDOM = useCallback((newIsDark: boolean) => {
    const root = document.documentElement;
    if (newIsDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // Initial load
  useEffect(() => {
    const savedTheme = loadTheme();
    // Logic to determine if dark
    let targetIsDark = false;
    if (savedTheme === "system") {
      targetIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      targetIsDark = savedTheme === "dark";
    }
    updateThemeDOM(targetIsDark);
    // eslint-disable-next-line
    setIsDark(targetIsDark);
  }, [updateThemeDOM]);

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    const newTheme = newIsDark ? "dark" : "light";

    // Check for View Transition API support
    if (
      !ref.current ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      saveTheme(newTheme);
      updateThemeDOM(newIsDark);
      setIsDark(newIsDark);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        saveTheme(newTheme);
        updateThemeDOM(newIsDark);
        setIsDark(newIsDark);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${radius}px at ${x}px ${y}px)`,
      ];

      // Always animate the NEW state expanding over the OLD state
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 1500,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)", // Soft exponential ease-out
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
    );
  }

  return (
    <button
      ref={ref}
      onClick={toggleTheme}
      className={cn(
        "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer",
        "bg-white/5 hover:bg-white/10 border border-white/5",
        "hover:shadow-[0_0_15px_-5px_rgba(255,255,255,0.5)] group"
      )}
      aria-label="Toggle Theme"
    >
      <div className={cn(
        "absolute inset-0 bg-primary/20 transition-transform duration-500 rounded-full",
        isDark ? "scale-0" : "scale-100 opacity-50"
      )} />

      <div className="relative z-10 transition-transform duration-500 rotate-0 dark:rotate-180">
        {isDark ? (
          <Moon className="w-4 h-4 text-primary transition-all duration-300" />
        ) : (
          <Sun className="w-4 h-4 text-orange-400 transition-all duration-300" />
        )}
      </div>
    </button>
  );
}

// Add type definition for ViewTransition if needed, but 'any' is implied in many setups. 
// We will augment the window interface in a separate declaration or just suppress TS errors if strictly typed.
declare global {
  interface Document {
    startViewTransition(callback: () => void): { ready: Promise<void> };
  }
}
