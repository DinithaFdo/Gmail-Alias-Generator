"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileSpreadsheet, Check, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { AliasResult } from "@/lib/alias-generator";
import { exportAsTxt, exportAsCsv } from "@/lib/export";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  aliases: AliasResult[];
  email: string;
  disabled?: boolean;
}

export function ExportButton({ aliases, email, disabled }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = (format: "txt" | "csv") => {
    if (format === "txt") {
      exportAsTxt(aliases, email);
    } else {
      exportAsCsv(aliases, email);
    }

    setExported(true);
    setShowMenu(false);

    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled}
        variant="secondary"
        className={cn(
          "h-12 px-8 rounded-full border-primary/20 hover:bg-primary/20 font-mono text-xs tracking-wider",
          exported && "text-green-500 border-green-500/50"
        )}
      >
        {exported ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            EXPORTED
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            EXPORT...
          </>
        )}
      </Button>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-xl shadow-2xl overflow-hidden min-w-[200px]"
            >
              <div className="p-1">
                <button
                  onClick={() => handleExport("txt")}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 rounded-lg transition-colors group"
                >
                  <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-mono tracking-wide">TEXT FILE (.TXT)</span>
                </button>

                <button
                  onClick={() => handleExport("csv")}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 rounded-lg transition-colors group"
                >
                  <FileSpreadsheet className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-mono tracking-wide">CSV FILE (.CSV)</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
