"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-6"
      >
        <div className="font-heading font-black text-[12rem] md:text-[20rem] leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary/20 to-transparent select-none">
          404
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl max-w-lg mx-auto -mt-12 backdrop-blur-2xl border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 relative z-10">
            SYSTEM_ERROR
          </h2>
          <p className="text-muted-foreground font-mono text-sm md:text-base mb-8 relative z-10">
            The requested trajectory data could not be found.
            The alias you are looking for has drifted into deep space.
          </p>

          <Link href="/">
            <Button className="h-12 px-8 rounded-full bg-primary hover:bg-primary/80 font-mono text-xs tracking-wider group relative z-10">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              RETURN TO BASE
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] pointer-events-none" />
    </div>
  );
}
