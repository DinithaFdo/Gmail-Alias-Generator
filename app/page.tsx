"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronDown, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { AliasCard } from "@/components/alias-card";
import { PresetSelector } from "@/components/preset-selector";
import { ExportButton } from "@/components/export-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toast, ToastContainer } from "@/components/toast";
import {
  validateEmail,
  generateDotPermutations,
  generatePlusTags,
  getTotalDotPermutations,
  PRESETS,
  AliasResult,
} from "@/lib/alias-generator";
import { saveToHistory, loadHistory, loadPreferences } from "@/lib/storage";
import { copyAllToClipboard } from "@/lib/export";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [dotCount, setDotCount] = useState(25);
  const [selectedPreset, setSelectedPreset] = useState<string>();
  const [customTag, setCustomTag] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [allAliases, setAllAliases] = useState<AliasResult[]>([]);
  const [displayLimit, setDisplayLimit] = useState(50);

  // Load preferences on mount
  useEffect(() => {
    const prefs = loadPreferences();
    setDotCount(prefs.defaultDotCount);
  }, []);

  // Validation
  const validation = useMemo(() => {
    if (!email) {
      return { isValid: false, error: "", isGmail: false, isWorkspace: false };
    }
    return validateEmail(email);
  }, [email]);

  // Generate aliases
  const aliases = useMemo(() => {
    if (!validation.isValid) return [];

    const result: AliasResult[] = [];

    // Add dot variations
    const dots = generateDotPermutations(email, dotCount);
    result.push(...dots);

    // Add plus tags
    const plus = generatePlusTags(email, customTag, selectedPreset, 5);
    result.push(...plus);

    return result;
  }, [email, validation.isValid, dotCount, selectedPreset, customTag]);

  // Generate when aliases change
  useEffect(() => {
    if (aliases.length > 0 && validation.isValid) {
      setAllAliases(aliases);
    }
  }, [aliases, validation.isValid]);

  const totalPossible = useMemo(() => {
    if (!email) return 0;
    return getTotalDotPermutations(email);
  }, [email]);

  const addToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "info"
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  const handleCopyAll = async () => {
    try {
      await copyAllToClipboard(aliases);
      addToast(`Copied ${aliases.length} aliases to clipboard`, "success");
    } catch (error) {
      addToast("Failed to copy aliases", "error");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleClearAll = () => {
    setEmail("");
    setSelectedPreset(undefined);
    setCustomTag("");
    setShowAdvanced(false);
    setAllAliases([]);
    setDisplayLimit(50);
  };

  const handleDownloadAll = async () => {
    if (!validation.isValid || !email) return;

    try {
      // Generate ALL possible dot combinations
      const allDotCombos = generateDotPermutations(email, totalPossible);

      // Combine with plus tags
      const allCombos = [
        ...allDotCombos,
        ...generatePlusTags(email, "", "shopping", 5),
        ...generatePlusTags(email, "", "newsletter", 5),
        ...generatePlusTags(email, "", "testing", 5),
        ...generatePlusTags(email, "", "work", 5),
        ...generatePlusTags(email, "", "social", 5),
        ...generatePlusTags(email, "", "finance", 5),
      ];

      // Create CSV content
      const csvContent = [
        ["Alias", "Type", "Category"],
        ...allCombos.map((a) => [a.alias, a.type, a.category || ""]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      // Create and trigger download
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
      );
      element.setAttribute("download", `gmail-aliases-all-${Date.now()}.csv`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      addToast(
        `Downloaded ${allCombos.length} total alias combinations!`,
        "success"
      );
    } catch (error) {
      addToast("Failed to download combinations", "error");
    }
  };

  const isLoading = false;
  const hasResults = validation.isValid && aliases.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-50 animate-pulse animation-delay-2000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-sm bg-background/95 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5"
          >
            <span className="text-2xl">📧</span>
            <div>
              <h1 className="text-base font-semibold text-foreground">
                Gmail Alias
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Simple email organization
              </p>
            </div>
          </motion.div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto]"
            style={{
              animation: "glow-gradient 3s ease-in-out infinite",
              backgroundSize: "200% auto",
            }}
          >
            Generate Gmail Aliases Instantly
          </h2>

          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Create email aliases to organize, filter, and protect your inbox.
            All aliases deliver to your Gmail - no forwarding, no setup.
          </p>

          <div className="inline-block">
            <div className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Free • Instant • No sign-up
            </div>
          </div>
        </motion.section>

        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border border-indigo-500/20 dark:border-indigo-500/30 overflow-hidden shadow-2xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 bg-gradient-to-br from-background via-background to-indigo-500/5 dark:to-indigo-500/10">
            <div className="p-6 md:p-8 space-y-6 relative">
              {/* Decorative gradient orb */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              {/* Email Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  Your Gmail Address
                </label>

                <div className="relative">
                  <Input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={cn(
                      "h-14 text-lg pl-4 rounded-2xl border-2 transition-all duration-200",
                      "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                      validation.error && email
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-border",
                      "bg-muted/20"
                    )}
                    autoComplete="email"
                  />
                </div>

                {/* Validation Message */}
                {validation.error && email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {validation.error}
                  </motion.div>
                )}

                {/* Success Message */}
                {validation.isValid && email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                  >
                    <Check className="w-4 h-4" />
                    {validation.isWorkspace
                      ? "Google Workspace account detected"
                      : "Gmail account confirmed"}
                  </motion.div>
                )}
              </div>

              {/* Advanced Options */}
              {validation.isValid && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6 pt-4 border-t border-border"
                >
                  {/* Dot Count Slider */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold">
                        Dot Variations
                      </label>
                      <div className="flex items-center gap-2">
                        <motion.span
                          key={dotCount}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full"
                        >
                          {dotCount} of {totalPossible}
                        </motion.span>
                      </div>
                    </div>

                    <Slider
                      value={[dotCount]}
                      onValueChange={(value) => setDotCount(value[0])}
                      min={5}
                      max={Math.min(totalPossible, 100)}
                      step={1}
                      className="w-full"
                    />

                    <p className="text-xs text-muted-foreground">
                      {dotCount === totalPossible
                        ? "Generating all possible variations"
                        : `Showing ${dotCount} sampled variations from ${totalPossible} possible`}
                    </p>
                  </div>

                  {/* Preset Selection */}
                  <div className="space-y-4">
                    <PresetSelector
                      presets={PRESETS}
                      selectedId={selectedPreset}
                      onSelect={setSelectedPreset}
                    />
                  </div>

                  {/* Custom Tag Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">
                      Custom Plus Tag
                    </label>

                    <Input
                      type="text"
                      placeholder="e.g., shopping, work, urgent"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      className="h-11 rounded-2xl border-2 border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/50"
                    />

                    {customTag && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="font-mono bg-muted/50 px-2 py-1 rounded">
                          {email.split("@")[0]}+
                          {customTag.toLowerCase().replace(/[^a-z0-9-]/g, "")}@
                          {email.split("@")[1]}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleCopyAll}
                        disabled={!hasResults}
                        className="flex-1 h-10 rounded-lg font-medium text-sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All ({aliases.length})
                      </Button>

                      <ExportButton
                        aliases={aliases}
                        email={email}
                        disabled={!hasResults}
                      />

                      <Button
                        onClick={handleClearAll}
                        variant="outline"
                        className="flex-1 h-10 rounded-lg font-medium text-sm"
                      >
                        Clear
                      </Button>
                    </div>

                    {hasResults && (
                      <Button
                        onClick={handleDownloadAll}
                        className="w-full h-10 rounded-lg font-medium text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        📥 Download All {totalPossible} Possible Combinations
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.section>

        {/* Info Section */}
        {!email && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 mb-12"
          >
            {[
              {
                icon: "📧",
                title: "Single Inbox",
                desc: "All aliases route to your Gmail inbox—nothing new to manage.",
              },
              {
                icon: "🎯",
                title: "Smart Filtering",
                desc: "Use filters to organize emails by alias.",
              },
              {
                icon: "🔒",
                title: "Privacy",
                desc: "Protect your main email.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <div className="p-5 border border-indigo-500/20 dark:border-indigo-500/30 rounded-lg bg-gradient-to-br from-indigo-50/50 dark:from-indigo-950/20 to-transparent hover:border-indigo-500/40 dark:hover:border-indigo-500/50 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {hasResults && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total", value: aliases.length },
                  {
                    label: "Dots",
                    value: aliases.filter((a) => a.type === "dot").length,
                  },
                  {
                    label: "Plus",
                    value: aliases.filter((a) => a.type === "plus").length,
                  },
                  { label: "Possible", value: totalPossible },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="p-4 text-center border border-indigo-500/20 dark:border-indigo-500/30 rounded-lg bg-gradient-to-br from-indigo-50/40 dark:from-indigo-950/30 to-transparent hover:border-indigo-500/40 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                      <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Aliases Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generated Aliases</h3>
                  <span className="text-xs text-muted-foreground">
                    Showing {Math.min(displayLimit, aliases.length)} of{" "}
                    {aliases.length}
                  </span>
                </div>

                <div className="grid gap-3">
                  {aliases.slice(0, displayLimit).map((alias, idx) => (
                    <AliasCard key={alias.id} alias={alias} index={idx} />
                  ))}
                </div>

                {aliases.length > displayLimit && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-3 pt-2"
                  >
                    <Button
                      onClick={() =>
                        setDisplayLimit((prev) =>
                          Math.min(prev + 50, aliases.length)
                        )
                      }
                      variant="outline"
                      className="w-full"
                    >
                      Load More ({aliases.length - displayLimit} remaining)
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Education Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Info className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">
                        How Gmail Aliases Work
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Learn more about organizing your email
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: showAdvanced ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-6 border-2 bg-muted/20 space-y-4">
                        <div className="space-y-3 text-sm">
                          <h4 className="font-bold">Dot Variations</h4>
                          <p className="text-muted-foreground">
                            Gmail ignores dots in email addresses.{" "}
                            <code className="bg-muted/50 px-2 py-1 rounded text-xs">
                              j.ohn@gmail.com
                            </code>{" "}
                            and{" "}
                            <code className="bg-muted/50 px-2 py-1 rounded text-xs">
                              john@gmail.com
                            </code>{" "}
                            both deliver to the same inbox.
                          </p>

                          <h4 className="font-bold pt-2">Plus Tags</h4>
                          <p className="text-muted-foreground">
                            Everything after a plus sign is ignored.{" "}
                            <code className="bg-muted/50 px-2 py-1 rounded text-xs">
                              john+shopping@gmail.com
                            </code>{" "}
                            goes to{" "}
                            <code className="bg-muted/50 px-2 py-1 rounded text-xs">
                              john@gmail.com
                            </code>
                            .
                          </p>

                          <h4 className="font-bold pt-2">Pro Tips</h4>
                          <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                            <li>
                              Use purpose-based tags for filtering (e.g.,
                              +shopping, +newsletters)
                            </li>
                            <li>
                              Create Gmail filters to auto-label emails by alias
                            </li>
                            <li>Use date-based tags to track signup timing</li>
                            <li>
                              Spot spam sources by seeing which alias received
                              unsolicited mail
                            </li>
                          </ul>

                          <div className="pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              <strong>Important:</strong> Don't use aliases for
                              security-critical accounts (banking, admin
                              panels). Use dedicated email addresses instead.
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-border/50 backdrop-blur-sm mt-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-3">About</h3>
              <p className="text-sm text-muted-foreground">
                Gmail Alias Generator helps you organize, filter, and track your
                inbox using Gmail's built-in alias features. No setup,
                completely free.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://support.google.com/mail"
                    className="hover:text-primary transition-colors"
                  >
                    Gmail Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.google.com/mail/answer/9211434"
                    className="hover:text-primary transition-colors"
                  >
                    Email aliases & addresses
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">
              Made with ❤️ by{" "}
              <a
                href="https://www.dinitha.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Dinitha Fernando
              </a>
            </p>
            <p>
              <a
                href="https://www.dinitha.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.dinitha.me
              </a>
            </p>
          </div>
        </div>
      </motion.footer>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
