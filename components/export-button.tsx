"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileSpreadsheet, Check } from "lucide-react";
import { Button } from "./ui/button";
import { AliasResult } from "@/lib/alias-generator";
import { exportAsTxt, exportAsCsv } from "@/lib/export";

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
    <div className="relative flex-1">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled}
        className={cn(
          "relative w-full rounded-lg h-10 font-medium text-sm",
          "bg-indigo-600 hover:bg-indigo-700",
          "text-white transition-all duration-300",
          exported && "bg-green-600 hover:bg-green-700"
        )}
      >
        {exported ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Exported
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export Aliases
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
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 right-0 z-50 bg-card border border-indigo-500/20 dark:border-indigo-500/30 rounded-lg shadow-2xl overflow-hidden min-w-[220px]"
            >
              <button
                onClick={() => handleExport("txt")}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <div className="text-left">
                  <div className="text-sm font-medium">Export as TXT</div>
                  <div className="text-xs text-muted-foreground">
                    Plain text format
                  </div>
                </div>
              </button>

              <div className="h-px bg-border" />

              <button
                onClick={() => handleExport("csv")}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-500" />
                <div className="text-left">
                  <div className="text-sm font-medium">Export as CSV</div>
                  <div className="text-xs text-muted-foreground">
                    Spreadsheet format
                  </div>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add cn utility import
import { cn } from "@/lib/utils";
