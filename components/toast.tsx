"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

export function Toast({ message, type = "info" }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const styles = {
    success: "border-green-500/50 text-green-500 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]",
    error: "border-red-500/50 text-red-500 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]",
    info: "border-blue-500/50 text-blue-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]",
    warning: "border-amber-500/50 text-amber-500 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]",
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "flex items-center gap-3 px-6 py-4 rounded-xl border bg-black/80 backdrop-blur-md",
        styles[type]
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-xs font-mono font-bold tracking-wide uppercase">{message}</p>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}
