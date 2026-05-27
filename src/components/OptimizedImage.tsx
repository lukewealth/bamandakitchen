/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChefHat, Sparkles } from "lucide-react";
import BrandLoader from "./BrandLoader";
import { cn } from "../lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  referrerPolicy?: string;
  containerClassName?: string;
  grayscaleOnHover?: boolean;
  colorOnHover?: boolean;
  aspectRatio?: string;
  priority?: boolean;
}

const OptimizedImage = memo(({ 
  src, 
  alt, 
  className, 
  containerClassName,
  grayscaleOnHover = false,
  colorOnHover = false,
  aspectRatio = "aspect-square",
  priority = false,
  ...props 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(!src || (src && !src.includes('.')));

  useEffect(() => {
    if (!src || !src.includes('.')) {
      setError(true);
      return;
    }
    
    setError(false);
    setIsLoaded(false);

    if (priority) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setTimeout(() => setIsLoaded(true), 100);
    };
    img.onerror = () => setError(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority]);

  return (
    <div className={cn("relative overflow-hidden bg-surface-variant flex items-center justify-center", aspectRatio, containerClassName)}>
      <AnimatePresence mode="wait">
        {!isLoaded && !error && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <BrandLoader isInline message="Preparing Visual" subMessage="Ancestral Rendering" />
          </motion.div>
        )}
      </AnimatePresence>

      {src && !error && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            scale: isLoaded ? 1 : 1.05 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            grayscaleOnHover && "grayscale hover:grayscale-0",
            colorOnHover && "grayscale hover:grayscale-0",
            !isLoaded && "invisible",
            className
          )}
          {...props}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5">
           {/* Premium Golden Aura */}
           <motion.div
            className="absolute inset-0 bg-accent/5 rounded-full blur-[60px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 relative z-10"
          >
            <div className="relative">
              <ChefHat className="w-20 h-20 text-accent stroke-[1.5px]" />
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-accent/60" />
              </motion.div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif italic text-black/80 text-sm tracking-[0.2em] uppercase">
                Chef's Heritage
              </span>
              <div className="h-[1px] w-12 bg-accent/30" />
              <span className="font-sans text-[8px] text-on-surface-variant uppercase tracking-[0.4em] font-black opacity-40">
                Signature Selection
              </span>
            </div>
          </motion.div>
          <div className="absolute inset-0 wood-texture opacity-[0.03] pointer-events-none" />
        </div>
      )}
    </div>
  );
});

export default OptimizedImage;
