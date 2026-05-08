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
      <div className="relative overflow-hidden bg-surface-variant aspect-[4/5] mb-8 border border-on-surface/5">
        <OptimizedImage 
          src={item.image} 
          alt={item.name} 
          referrerPolicy="no-referrer"
          aspectRatio="h-full w-full"
          className="grayscale transition-transform duration-1000 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-110"
        />
        <button className="absolute top-4 right-4 w-10 h-10 border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:text-accent transition-colors z-20">
          <Heart className="w-5 h-5" />
        </button>
        
        {item.tag && (
          <div className="absolute top-4 left-4 bg-accent px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-primary z-20">
            {item.tag}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-3xl italic text-on-surface leading-tight group-hover:text-accent transition-colors duration-500">
            {item.name}
          </h3>
          <span className="font-bold text-accent font-sans text-xs pt-2">
            ₦ {item.price.toLocaleString()}
          </span>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed line-clamp-2 uppercase tracking-wide opacity-80">
          {item.description}
        </p>
      </div>

      <button 
        onClick={() => onAddToCart(item)}
        className="mt-8 w-full py-4 border border-on-surface/10 text-on-surface font-sans uppercase tracking-[0.3em] text-[9px] font-bold hover:bg-white hover:text-black hover:border-white transition-all duration-500 flex items-center justify-center gap-2"
      >
        <Plus className="w-3 h-3" />
        Select Item
      </button>
    </motion.div>
  );
});

export default MenuCard;
