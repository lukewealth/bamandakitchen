/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ChefHat, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface BrandLoaderProps {
  message?: string;
  subMessage?: string;
  isInline?: boolean;
}

export default function BrandLoader({ 
  message = "Curation in Progress", 
  subMessage = "Consulting Ancestral Recipes",
  isInline = false
}: BrandLoaderProps) {
  return (
    <div className={cn(
      "z-[300] flex items-center justify-center backdrop-blur-2xl transition-all duration-700",
      isInline ? "absolute inset-0 bg-primary/20 rounded-[2rem]" : "fixed inset-0 bg-primary/98"
    )}>
      <div className={cn(
        "relative flex flex-col items-center",
        isInline ? "scale-[0.55] sm:scale-75" : "scale-100"
      )}>
        {/* Animated Background Aura - More dramatic for premium feel */}
        <motion.div
          className="absolute -inset-40 bg-accent/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative mb-12">
          {/* Outer Rotating Ritual Ring - Thinner, more elegant */}
          <motion.div
            className={cn(
              "border-t border-b border-accent/20 rounded-full",
              isInline ? "w-28 h-28" : "w-48 h-48"
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Fast Rotating Ring - Accent color */}
          <motion.div
            className={cn(
              "absolute inset-4 border-l border-accent/60 rounded-full",
              isInline ? "inset-3" : "inset-4"
            )}
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Center Icon Group */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <ChefHat className={cn("text-accent stroke-[1.5px]", isInline ? "w-12 h-12" : "w-20 h-20")} />
              <motion.div
                className="absolute -top-6 -right-6"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 1, 0.3],
                  rotate: [0, 45, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Sparkles className={cn("text-white/80", isInline ? "w-5 h-5" : "w-8 h-8")} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Textual Feedback - Refined typography */}
        <motion.div 
          className={cn("text-center space-y-4", isInline ? "mt-4" : "mt-8")}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className={cn(
            "font-serif italic text-white tracking-[0.1em] lowercase first-letter:uppercase",
            isInline ? "text-base" : "text-3xl"
          )}>
            {message}
          </h2>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[0.5px] w-10 bg-accent/30" />
             <p className="font-sans text-[9px] uppercase tracking-[0.5em] text-accent/80 font-black">
               {subMessage}
             </p>
             <div className="h-[0.5px] w-10 bg-accent/30" />
          </div>
        </motion.div>

        {/* Loading Progress Simulation Dots - More subtle */}
        {!isInline && (
          <div className="mt-12 flex gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-accent/40 rounded-full"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Wood Texture Overlay */}
      {!isInline && (
        <div className="absolute inset-0 wood-texture opacity-[0.03] pointer-events-none" />
      )}
    </div>
  );
}
