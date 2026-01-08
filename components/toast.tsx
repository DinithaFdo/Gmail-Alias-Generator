"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose?: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success:
      "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300",
    error: "bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-300",
    warning:
      "bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-300",
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 shadow-lg backdrop-blur-sm",
        colors[type]
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}
