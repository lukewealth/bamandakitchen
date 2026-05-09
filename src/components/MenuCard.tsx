/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from "react";
import { Plus, Heart } from "lucide-react";
import { MenuItem } from "../types";
import { motion } from "motion/react";
import OptimizedImage from "./OptimizedImage";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  key?: string | number;
}

const MenuCard = memo(({ item, onAddToCart }: MenuCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-surface-variant aspect-[4/5] mb-8 border border-on-surface/5 rounded-[2rem]">
        <OptimizedImage 
          src={item.image} 
          alt={item.name} 
          referrerPolicy="no-referrer"
          aspectRatio="h-full w-full"
          className="grayscale transition-transform duration-1000 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-110"
        />
        
        {/* Price Overlay - Stable 1x scale on hover */}
        <motion.div 
          whileHover={{ scale: 1 }}
          className="absolute bottom-6 right-6 bg-on-surface text-surface px-6 py-3 rounded-2xl font-sans font-black text-xs z-20 shadow-2xl border border-white/10"
        >
          ₦{item.price.toLocaleString()}
        </motion.div>

        <button className="absolute top-6 right-6 w-12 h-12 border border-white/20 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:text-accent transition-all z-20 active:scale-95">
          <Heart className="w-5 h-5" />
        </button>
        
        {item.tag && (
          <div className="absolute top-6 left-6 bg-accent px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary z-20 rounded-lg shadow-lg">
            {item.tag}
          </div>
        )}
      </div>

      <div className="space-y-4 px-2">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-3xl italic text-on-surface leading-tight group-hover:text-accent transition-colors duration-500">
            {item.name}
          </h3>
        </div>
        <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed line-clamp-2 uppercase tracking-[0.15em] opacity-60">
          {item.description}
        </p>
      </div>

      <button 
        onClick={() => onAddToCart(item)}
        className="mt-10 w-full py-5 bg-on-surface text-surface font-sans uppercase tracking-[0.3em] text-[10px] font-black hover:bg-accent hover:text-primary transition-all duration-500 flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-on-surface/10 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        Select Item
      </button>
    </motion.div>
  );
});

export default MenuCard;
