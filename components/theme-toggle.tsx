"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";
import { saveTheme, loadTheme } from "@/lib/storage";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = loadTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;

    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(systemPrefersDark);
      root.classList.toggle("dark", systemPrefersDark);
    } else {
      setIsDark(newTheme === "dark");
      root.classList.toggle("dark", newTheme === "dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50">
        <div className="w-4 h-4" />
        <div className="w-10 h-5 bg-muted rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm border border-border/50 shadow-sm">
      <Sun className="w-4 h-4 text-amber-500" />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-indigo-600"
      />
      <Moon className="w-4 h-4 text-indigo-500" />
    </div>
  );
}
