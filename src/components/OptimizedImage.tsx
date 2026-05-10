/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    <div className={cn("relative overflow-hidden bg-on-surface/5", aspectRatio, containerClassName)}>
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/5">
          <BrandLoader 
            isInline 
            message="Item Unavailable" 
            subMessage="Chef's Selection Pending" 
          />
          <div className="absolute inset-0 wood-texture opacity-5 pointer-events-none" />
        </div>
      )}
    </div>
  );
});

export default OptimizedImage;
