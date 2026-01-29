"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronDown, AlertCircle, Info, RefreshCw, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { AliasCard } from "@/components/alias-card";
import { PresetSelector } from "@/components/preset-selector";
import { ExportButton } from "@/components/export-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toast, ToastContainer } from "@/components/toast";
import { PagePreloader } from "@/components/page-preloader";
import {
  validateEmail,
  generateDotPermutations,
  generatePlusTags,
  getTotalDotPermutations,
  PRESETS,
  AliasResult,
} from "@/lib/alias-generator";
import { loadPreferences } from "@/lib/storage";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefs = loadPreferences();
    setDotCount(prefs.defaultDotCount);
  }, []);

  const validation = useMemo(() => {
    if (!email) return { isValid: false, error: "", isGmail: false, isWorkspace: false };
    return validateEmail(email);
  }, [email]);

  const aliases = useMemo(() => {
    if (!validation.isValid) return [];
    const result: AliasResult[] = [];
    result.push(...generateDotPermutations(email, dotCount));
    result.push(...generatePlusTags(email, customTag, selectedPreset, 5));
    return result;
  }, [email, validation.isValid, dotCount, selectedPreset, customTag]);

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
    (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    },
    []
  );

  const handleCopyAll = async () => {
    try {
      await copyAllToClipboard(aliases);
      addToast(`COPIED ${aliases.length} ALIASES`, "success");
    } catch {
      addToast("COPY FAILED", "error");
    }
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
      const allDotCombos = generateDotPermutations(email, totalPossible);
      const allCombos = [
        ...allDotCombos,
        ...generatePlusTags(email, "", "shopping", 5),
        ...generatePlusTags(email, "", "newsletter", 5),
        ...generatePlusTags(email, "", "testing", 5),
        ...generatePlusTags(email, "", "work", 5),
        ...generatePlusTags(email, "", "social", 5),
        ...generatePlusTags(email, "", "finance", 5),
      ];

      const csvContent = [
        ["Alias", "Type", "Category"],
        ...allCombos.map((a) => [a.alias, a.type, a.category || ""]),
      ].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

      const element = document.createElement("a");
      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
      element.setAttribute("download", `GMAIL-ALIASES-${Date.now()}.csv`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      addToast(`DOWNLOADED ${allCombos.length} COMBINATIONS`, "success");
    } catch {
      addToast("DOWNLOAD FAILED", "error");
    }
  };

  const hasResults = validation.isValid && aliases.length > 0;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-x-hidden">
      <PagePreloader />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <ToastContainer toasts={toasts} />

      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-heading font-black text-xl tracking-tighter flex items-center gap-2">
            <span className="text-primary">///</span>
            <span>ALIAS_GEN</span>
            <span className="text-xs font-mono text-muted-foreground ml-2 opacity-50">v2.0</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
            <span className="block text-foreground/80 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-white/50">GENERATE.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-accent animate-pulse">PROTECT.</span>
            <span className="block text-foreground/80 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-white/50">ORGANIZE.</span>
          </h1>
          <p className="font-mono text-sm md:text-base text-muted-foreground max-w-xl mx-auto uppercase tracking-widest">
            Advanced Gmail Alias Generation System
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-3xl mx-auto mb-24 relative"
        >
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl opacity-20 blur transition duration-500 group-hover:opacity-40" />
            <div className="relative glass-panel rounded-xl p-8 md:p-12 overflow-hidden">
              <label className="block text-xs font-mono text-primary mb-4 tracking-widest uppercase">
                Enter Source Email
              </label>
              <input
                type="email"
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-3xl md:text-5xl font-bold font-heading border-none outline-none placeholder:text-muted-foreground/50 text-foreground transition-all"
                autoComplete="off"
                spellCheck="false"
              />

              <div className="mt-8 flex items-center justify-between min-h-[24px]">
                <AnimatePresence mode="wait">
                  {validation.error ? (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-destructive font-mono text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {validation.error.toUpperCase()}
                    </motion.div>
                  ) : validation.isValid ? (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-green-500 font-mono text-sm"
                    >
                      <Check className="w-4 h-4" />
                      {validation.isWorkspace ? "WORKSPACE_DETECTED" : "GMAIL_CONFIRMED"}
                    </motion.div>
                  ) : (
                    <div />
                  )}
                </AnimatePresence>

                {validation.isValid && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-mono text-muted-foreground"
                  >
                    {totalPossible.toLocaleString()} PERMUTATIONS
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {hasResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-4 glass-panel rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-muted-foreground uppercase">Dot Density</span>
                    <span className="font-mono text-xs text-primary">{dotCount}</span>
                  </div>
                  <Slider
                    value={[dotCount]}
                    onValueChange={(v) => setDotCount(v[0])}
                    max={Math.min(totalPossible, 100)}
                    step={1}
                    min={5}
                    className="py-2"
                  />
                </div>

                <div className="md:col-span-4 glass-panel rounded-xl p-6">
                  <span className="font-mono text-xs text-muted-foreground uppercase block mb-3">Preset Tags</span>
                  <PresetSelector
                    presets={PRESETS}
                    selectedId={selectedPreset}
                    onSelect={setSelectedPreset}
                  />
                </div>

                <div className="md:col-span-4 glass-panel rounded-xl p-6">
                  <span className="font-mono text-xs text-muted-foreground uppercase block mb-3">Custom Tag</span>
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="+tag"
                    className="glass-input h-9 border-0 bg-white/5 rounded-lg"
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleCopyAll} className="h-12 px-8 rounded-full bg-primary hover:bg-primary/80 font-mono text-xs tracking-wider">
                  COPY ALL ({aliases.length})
                </Button>
                <ExportButton aliases={aliases} email={email} disabled={!hasResults} />
                <Button onClick={handleDownloadAll} variant="outline" className="h-12 px-8 rounded-full border-primary/20 hover:bg-primary/10 font-mono text-xs tracking-wider">
                  DOWNLOAD CSV
                </Button>
                <Button onClick={handleClearAll} variant="ghost" className="h-12 w-12 rounded-full p-0">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {aliases.slice(0, displayLimit).map((alias, i) => (
                  <AliasCard key={alias.id} alias={alias} index={i} />
                ))}
              </div>

              {aliases.length > displayLimit && (
                <div className="flex justify-center pt-10">
                  <Button
                    onClick={() => setDisplayLimit(d => Math.min(d + 50, aliases.length))}
                    variant="secondary"
                    className="rounded-full px-8 font-mono text-xs"
                  >
                    LOAD MORE (+{aliases.length - displayLimit})
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 mt-32 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/50" />
          <Zap className="w-4 h-4 text-primary" />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/50" />
        </div>
        <p className="font-mono text-sm text-muted-foreground flex items-center justify-center gap-2">
          Made with <span className="text-primary animate-pulse">❤</span> by
          <a href="https://www.dinitha.me" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline decoration-primary/50 underline-offset-4">
            Dinitha
          </a>
        </p>
      </footer>
    </div>
  );
}
