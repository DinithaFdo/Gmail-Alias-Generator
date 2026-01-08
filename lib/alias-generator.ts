/**
 * Core alias generation utilities for Gmail addresses
 * Handles dot permutations, plus tags, and smart sampling
 */

export interface AliasResult {
  id: string;
  alias: string;
  type: "dot" | "plus" | "custom";
  category?: string;
}

export interface PresetOption {
  id: string;
  label: string;
  icon: string;
  tags: string[];
}

export const PRESETS: PresetOption[] = [
  {
    id: "shopping",
    label: "Shopping",
    icon: "🛒",
    tags: ["shop", "deals", "store", "purchase", "cart"],
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: "📰",
    tags: ["newsletter", "updates", "news", "digest", "subscription"],
  },
  {
    id: "testing",
    label: "Testing",
    icon: "🧪",
    tags: ["test", "dev", "staging", "qa", "demo"],
  },
  {
    id: "work",
    label: "Work",
    icon: "💼",
    tags: ["work", "business", "professional", "corporate", "office"],
  },
  {
    id: "social",
    label: "Social",
    icon: "🎭",
    tags: ["social", "community", "forum", "network", "connect"],
  },
  {
    id: "finance",
    label: "Finance",
    icon: "💳",
    tags: ["finance", "billing", "payment", "invoice", "receipt"],
  },
];

/**
 * Validates if email is a Gmail address
 * Note: Outlook, Yahoo, and other providers don't support this alias trick
 * Only Gmail supports dot variations and plus tags reliably
 */
export function validateEmail(email: string): {
  isValid: boolean;
  isGmail: boolean;
  isWorkspace: boolean;
  error?: string;
} {
  const trimmed = email.trim().toLowerCase();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      isGmail: false,
      isWorkspace: false,
      error: "Please enter a valid email address",
    };
  }

  const [localPart, domain] = trimmed.split("@");

  // Only accept Gmail - Outlook, Yahoo, etc don't support this feature
  if (domain === "gmail.com") {
    return {
      isValid: true,
      isGmail: true,
      isWorkspace: false,
    };
  }

  // Reject all other providers
  return {
    isValid: false,
    isGmail: false,
    isWorkspace: false,
    error:
      "Only Gmail addresses are supported. This feature works exclusively with Gmail.",
  };
}

/**
 * Extract local part (before @) from email
 */
function getLocalPart(email: string): string {
  return email.split("@")[0];
}

/**
 * Extract domain part (after @) from email
 */
function getDomain(email: string): string {
  return email.split("@")[1];
}

/**
 * Generate all possible dot permutations with smart sampling
 * Limits to maxCount to prevent combinatorial explosion
 */
export function generateDotPermutations(
  email: string,
  maxCount: number = 25
): AliasResult[] {
  const localPart = getLocalPart(email);
  const domain = getDomain(email);

  // Remove existing dots to get base
  const base = localPart.replace(/\./g, "");

  if (base.length < 2) {
    return [];
  }

  const results: AliasResult[] = [];
  const seen = new Set<string>();

  // Generate positions where dots can be placed (between characters)
  const positions = base.length - 1;
  const totalPossible = Math.pow(2, positions);

  // If total possible is small, generate all
  if (totalPossible <= maxCount) {
    for (let i = 0; i < totalPossible; i++) {
      const variation = generateDotVariation(base, i, positions);
      const alias = `${variation}@${domain}`;

      if (!seen.has(alias)) {
        seen.add(alias);
        results.push({
          id: `dot-${i}`,
          alias,
          type: "dot",
        });
      }
    }
  } else {
    // Smart sampling: generate diverse set
    const step = Math.floor(totalPossible / maxCount);

    for (let i = 0; i < maxCount; i++) {
      const index = i * step;
      const variation = generateDotVariation(base, index, positions);
      const alias = `${variation}@${domain}`;

      if (!seen.has(alias)) {
        seen.add(alias);
        results.push({
          id: `dot-${i}`,
          alias,
          type: "dot",
        });
      }
    }

    // Always include original and fully dotted versions
    const original = localPart;
    const fullyDotted = base.split("").join(".");

    [original, fullyDotted].forEach((variation, idx) => {
      const alias = `${variation}@${domain}`;
      if (!seen.has(alias)) {
        seen.add(alias);
        results.unshift({
          id: `dot-special-${idx}`,
          alias,
          type: "dot",
        });
      }
    });
  }

  return results;
}

/**
 * Generate a specific dot variation based on binary pattern
 */
function generateDotVariation(
  base: string,
  pattern: number,
  positions: number
): string {
  let result = base[0];

  for (let i = 0; i < positions; i++) {
    // Check if bit at position i is set
    if (pattern & (1 << i)) {
      result += ".";
    }
    result += base[i + 1];
  }

  return result;
}

/**
 * Generate plus tag aliases with presets and custom options
 */
export function generatePlusTags(
  email: string,
  customTag?: string,
  presetId?: string,
  count: number = 5
): AliasResult[] {
  const localPart = getLocalPart(email).replace(/\+.*$/, ""); // Remove existing plus tags
  const domain = getDomain(email);
  const results: AliasResult[] = [];

  // Add custom tag if provided
  if (customTag && customTag.trim()) {
    const sanitized = customTag
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    if (sanitized) {
      results.push({
        id: `plus-custom-${sanitized}`,
        alias: `${localPart}+${sanitized}@${domain}`,
        type: "plus",
        category: "custom",
      });
    }
  }

  // Add preset tags if selected
  if (presetId) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      preset.tags.slice(0, count).forEach((tag, idx) => {
        results.push({
          id: `plus-${presetId}-${idx}`,
          alias: `${localPart}+${tag}@${domain}`,
          type: "plus",
          category: preset.label,
        });
      });
    }
  }

  // Add date-based tags
  const dateTag = new Date().toISOString().split("T")[0].replace(/-/g, "");
  results.push({
    id: `plus-date-${dateTag}`,
    alias: `${localPart}+${dateTag}@${domain}`,
    type: "plus",
    category: "date",
  });

  // Add random tags
  const randomTags = ["alpha", "beta", "gamma", "delta", "omega"];
  randomTags.slice(0, Math.min(3, count)).forEach((tag, idx) => {
    results.push({
      id: `plus-random-${idx}`,
      alias: `${localPart}+${tag}@${domain}`,
      type: "plus",
      category: "random",
    });
  });

  return results;
}

/**
 * Get count of total possible dot permutations
 */
export function getTotalDotPermutations(email: string): number {
  const localPart = getLocalPart(email);
  const base = localPart.replace(/\./g, "");

  if (base.length < 2) return 0;

  const positions = base.length - 1;
  return Math.pow(2, positions);
}
