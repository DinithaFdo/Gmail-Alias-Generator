"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Hash } from "lucide-react";
import { AliasResult } from "@/lib/alias-generator";
import { cn } from "@/lib/utils";

interface AliasCardProps {
  alias: AliasResult;
  index: number;
}

export function AliasCard({ alias, index }: AliasCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(alias.alias);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const isDot = alias.type === "dot";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div
        onClick={handleCopy}
        className="glass-panel rounded-lg p-4 cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_var(--primary)]"
      >
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border",
                isDot
                  ? "border-primary/20 text-primary bg-primary/5"
                  : "border-accent/20 text-accent bg-accent/5"
              )}>
                {isDot ? "DOT_VAR" : "PLUS_TAG"}
              </span>

              {alias.category && (
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground">
                  {alias.category}
                </span>
              )}
            </div>

            <p className="font-mono text-sm text-foreground/90 truncate break-all selection:bg-white/20">
              {alias.alias}
            </p>
          </div>

          <div className="flex items-center justify-center absolute right-4 transition-opacity duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-primary" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
