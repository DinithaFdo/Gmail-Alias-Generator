"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
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

  const getCategoryColor = () => {
    if (!alias.category) return "bg-muted/50";

    const colors: Record<string, string> = {
      custom: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
      Shopping: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      Newsletter: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
      Testing: "bg-green-500/10 text-green-700 dark:text-green-300",
      Work: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      Social: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
      Finance: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      date: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
      random: "bg-gray-500/10 text-gray-700 dark:text-gray-300",
    };

    return colors[alias.category] || "bg-muted/50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-4 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {alias.category && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    getCategoryColor()
                  )}
                >
                  {alias.category}
                </span>
              )}
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {alias.type === "dot" ? "Dot Variation" : "Plus Tag"}
              </span>
            </div>

            <p className="font-mono text-sm md:text-base font-medium text-foreground truncate">
              {alias.alias}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={cn(
              "shrink-0 h-9 w-9 rounded-full transition-all duration-200",
              copied
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "hover:bg-primary/10 hover:text-primary"
            )}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
