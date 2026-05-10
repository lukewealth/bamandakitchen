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
      "z-[300] flex items-center justify-center backdrop-blur-xl transition-all duration-500",
      isInline ? "absolute inset-0 bg-primary/40 rounded-lg" : "fixed inset-0 bg-primary/95"
    )}>
      <div className={cn(
        "relative flex flex-col items-center",
        isInline && "scale-[0.6] sm:scale-75"
      )}>
        {/* Animated Background Aura */}
        <motion.div
          className="absolute -inset-20 bg-accent/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative">
          {/* Outer Rotating Ritual Ring */}
          <motion.div
            className={cn(
              "border-t-2 border-b-2 border-accent/30 rounded-full",
              isInline ? "w-24 h-24" : "w-40 h-40"
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Fast Rotating Ring */}
          <motion.div
            className="absolute inset-4 border-l-2 border-accent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Center Icon Group */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <ChefHat className={cn("text-accent", isInline ? "w-10 h-10" : "w-16 h-16")} />
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className={cn("text-white", isInline ? "w-4 h-4" : "w-6 h-6")} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Textual Feedback */}
        <motion.div 
          className={cn("text-center space-y-3", isInline ? "mt-6" : "mt-12")}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={cn(
            "font-serif italic text-white tracking-wide uppercase",
            isInline ? "text-sm" : "text-2xl"
          )}>
            {message}
          </h2>
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-accent/40" />
             <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-accent font-black">
               {subMessage}
             </p>
             <div className="h-px w-8 bg-accent/40" />
          </div>
        </motion.div>

        {/* Loading Progress Simulation Dots */}
        {!isInline && (
          <div className="mt-8 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-accent rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 1, 0.2]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
