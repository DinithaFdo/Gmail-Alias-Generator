"use client";

import { motion } from "framer-motion";
import { PresetOption } from "@/lib/alias-generator";
import { cn } from "@/lib/utils";

interface PresetSelectorProps {
  presets: PresetOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function PresetSelector({
  presets,
  selectedId,
  onSelect,
}: PresetSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
      {presets.map((preset, index) => {
        const isSelected = selectedId === preset.id;

        return (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(preset.id)}
            className={cn(
              "relative px-3 py-2 rounded-lg border text-left transition-all duration-300",
              "flex flex-col gap-1 items-start",
              isSelected
                ? "bg-primary/20 border-primary shadow-[0_0_15px_-5px_var(--primary)]"
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
            )}
          >
            <span className="text-xl mb-1">{preset.icon}</span>
            <span className={cn(
              "text-[10px] font-mono uppercase tracking-widest",
              isSelected ? "text-primary-foreground" : "text-muted-foreground"
            )}>
              {preset.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
