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
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Choose a preset category
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {presets.map((preset, index) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(preset.id)}
            className={cn(
              "relative p-4 rounded-2xl border-2 transition-all duration-300",
              "flex flex-col items-center gap-2",
              "hover:shadow-lg hover:shadow-primary/10",
              selectedId === preset.id
                ? "border-primary bg-primary/5 shadow-md shadow-primary/20"
                : "border-border hover:border-primary/50 bg-card"
            )}
          >
            <span className="text-2xl">{preset.icon}</span>
            <span className="text-sm font-medium">{preset.label}</span>

            {selectedId === preset.id && (
              <motion.div
                layoutId="preset-indicator"
                className="absolute inset-0 rounded-2xl border-2 border-primary"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
