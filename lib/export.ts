/**
 * Export utilities for alias data
 * Supports TXT and CSV formats
 */

import { AliasResult } from "./alias-generator";

/**
 * Export aliases as plain text file
 */
export function exportAsTxt(aliases: AliasResult[], email: string): void {
  const content = generateTxtContent(aliases, email);
  downloadFile(
    content,
    `gmail-aliases-${sanitizeFilename(email)}.txt`,
    "text/plain"
  );
}

/**
 * Export aliases as CSV file
 */
export function exportAsCsv(aliases: AliasResult[], email: string): void {
  const content = generateCsvContent(aliases);
  downloadFile(
    content,
    `gmail-aliases-${sanitizeFilename(email)}.csv`,
    "text/csv"
  );
}

/**
 * Generate TXT content
 */
function generateTxtContent(aliases: AliasResult[], email: string): string {
  const lines: string[] = [];

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("  Gmail Alias Generator - Export");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("");
  lines.push(`Original Email: ${email}`);
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push(`Total Aliases: ${aliases.length}`);
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("");

  // Group by type
  const dotAliases = aliases.filter((a) => a.type === "dot");
  const plusAliases = aliases.filter((a) => a.type === "plus");
  const customAliases = aliases.filter((a) => a.type === "custom");

  if (dotAliases.length > 0) {
    lines.push("DOT VARIATIONS:");
    lines.push("");
    dotAliases.forEach((alias, idx) => {
      lines.push(`  ${idx + 1}. ${alias.alias}`);
    });
    lines.push("");
  }

  if (plusAliases.length > 0) {
    lines.push("PLUS TAG VARIATIONS:");
    lines.push("");
    plusAliases.forEach((alias, idx) => {
      const category = alias.category ? ` (${alias.category})` : "";
      lines.push(`  ${idx + 1}. ${alias.alias}${category}`);
    });
    lines.push("");
  }

  if (customAliases.length > 0) {
    lines.push("CUSTOM VARIATIONS:");
    lines.push("");
    customAliases.forEach((alias, idx) => {
      lines.push(`  ${idx + 1}. ${alias.alias}`);
    });
    lines.push("");
  }

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("");
  lines.push("NOTE: All these aliases deliver to your main inbox.");
  lines.push("Use them to organize, filter, and track email sources.");
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate CSV content
 */
function generateCsvContent(aliases: AliasResult[]): string {
  const lines: string[] = [];

  // Header
  lines.push("Alias,Type,Category");

  // Data rows
  aliases.forEach((alias) => {
    const category = alias.category || "";
    lines.push(`"${alias.alias}","${alias.type}","${category}"`);
  });

  return lines.join("\n");
}

/**
 * Sanitize filename
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/@/g, "-at-")
    .replace(/[^a-z0-9-_.]/gi, "-")
    .toLowerCase();
}

/**
 * Trigger file download
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Copy all aliases to clipboard (for quick copy feature)
 */
export function copyAllToClipboard(aliases: AliasResult[]): Promise<void> {
  const text = aliases.map((a) => a.alias).join("\n");
  return navigator.clipboard.writeText(text);
}
