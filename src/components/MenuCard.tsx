/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useState, useEffect } from "react";
import { Plus, Heart } from "lucide-react";
import { MenuItem } from "../types";
import { motion } from "motion/react";
import OptimizedImage from "./OptimizedImage";
import { patronTracker } from "../lib/security";
import { cn } from "../lib/utils";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  key?: string | number;
}

const MenuCard = memo(({ item, onAddToCart }: MenuCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(patronTracker.isManualFavorite(item.id));
  }, [item.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = patronTracker.toggleManualFavorite(item.id);
    setIsFavorite(newState);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group z-10"
    >
      <div className="relative overflow-hidden bg-surface-variant aspect-[4/5] mb-8 border border-on-surface/5 rounded-[2rem]">
        {/* System Metadata Hover */}
        <div className="absolute top-4 left-4 z-[30] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md text-white/40 p-3 rounded-xl border border-white/10 text-[6px] font-mono shadow-2xl">
            ID: {item.id.slice(0, 8)}... | {item.category.toUpperCase()}
          </div>
        </div>

        <OptimizedImage 
          src={item.image} 
          alt={item.name} 
          referrerPolicy="no-referrer"
          aspectRatio="h-full w-full"
          className="transition-transform duration-1000 group-hover:scale-110 group-hover:brightness-110"
        />
        
        {/* Hover Description Overlay (Web) / Active State (Mobile) */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-500 flex items-center justify-center p-8 z-10">
          <p className="font-sans text-white text-center text-base leading-relaxed tracking-wide opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-700 delay-100">
            {item.description}
          </p>
        </div>

        {/* Price Overlay - Stable 1x scale on hover */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-6 right-6 bg-on-surface text-surface px-6 py-3 rounded-2xl font-sans font-black text-sm z-20 shadow-2xl border border-white/10"
        >
          ₦{item.price.toLocaleString()}
        </motion.div>

        <button 
          onClick={toggleFavorite}
          className={cn(
            "absolute top-6 right-6 w-12 h-12 border border-white/20 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all z-20 active:scale-95",
            isFavorite ? "text-accent border-accent/40" : "text-white hover:text-accent"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
        
        {item.tag && (
          <div className="absolute top-6 left-6 bg-accent px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary z-20 rounded-lg shadow-lg">
            {item.tag}
          </div>
        )}
      </div>

      <div className="space-y-4 px-2">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-3xl italic text-black leading-tight group-hover:text-accent transition-colors duration-500">
            {item.name}
          </h3>
        </div>
        <p className="font-sans text-base text-on-surface-variant leading-relaxed line-clamp-2 tracking-normal opacity-70 group-hover:opacity-0 transition-opacity duration-300">
          {item.description}
        </p>
      </div>

      <button 
        onClick={() => onAddToCart(item)}
        className="mt-10 w-full py-6 bg-on-surface text-surface font-sans uppercase tracking-[0.3em] text-xs font-black hover:bg-accent hover:text-primary transition-all duration-500 flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-on-surface/10 active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        Add to Selection
      </button>
    </motion.div>
  );
});

export default MenuCard;
