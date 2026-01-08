/**
 * LocalStorage utilities for persisting user data
 * Handles theme preferences, alias history, and user settings
 */

import { AliasResult } from "./alias-generator";

const STORAGE_KEYS = {
  THEME: "gmail-alias-theme",
  HISTORY: "gmail-alias-history",
  PREFERENCES: "gmail-alias-preferences",
} as const;

export interface HistoryEntry {
  id: string;
  email: string;
  aliases: AliasResult[];
  timestamp: number;
}

export interface UserPreferences {
  defaultDotCount: number;
  defaultPlusCount: number;
  autoGenerateOnInput: boolean;
}

/**
 * Save theme preference
 */
export function saveTheme(theme: "light" | "dark" | "system"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Load theme preference
 */
export function loadTheme(): "light" | "dark" | "system" {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  return (saved as "light" | "dark" | "system") || "system";
}

/**
 * Save alias generation to history
 */
export function saveToHistory(email: string, aliases: AliasResult[]): void {
  if (typeof window === "undefined") return;

  const history = loadHistory();
  const newEntry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    aliases,
    timestamp: Date.now(),
  };

  // Add to beginning and limit to 10 entries
  const updated = [newEntry, ...history].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
}

/**
 * Load alias history
 */
export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

/**
 * Clear alias history
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

/**
 * Save user preferences
 */
export function savePreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === "undefined") return;

  const current = loadPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
}

/**
 * Load user preferences
 */
export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return {
      defaultDotCount: 25,
      defaultPlusCount: 5,
      autoGenerateOnInput: true,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    const defaults: UserPreferences = {
      defaultDotCount: 25,
      defaultPlusCount: 5,
      autoGenerateOnInput: true,
    };

    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch (error) {
    console.error("Failed to load preferences:", error);
    return {
      defaultDotCount: 25,
      defaultPlusCount: 5,
      autoGenerateOnInput: true,
    };
  }
}
