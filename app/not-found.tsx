"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-50 animate-pulse animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* 404 Text with animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Page not found</h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Oops! This page seems to have disappeared. Don't worry, we'll help you
          get back on track.
        </p>

        {/* Animated elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          <Link href="/" className="w-full">
            <Button className="w-full h-12 rounded-2xl text-base font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg">
              Back to Home
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground">
            Let's generate those Gmail aliases instead 😊
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
