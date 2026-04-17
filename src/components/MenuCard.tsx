/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, Heart } from 'lucide-react';
import { MenuItem } from '../types';
import { motion } from 'motion/react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  key?: string | number;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-surface-variant aspect-[4/5] mb-8 border border-on-surface/5">
        <img 
          src={item.image} 
          alt={item.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
        />
        <button className="absolute top-4 right-4 w-10 h-10 border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:text-accent transition-colors">
          <Heart className="w-5 h-5" />
        </button>
        
        {item.tag && (
          <div className="absolute top-4 left-4 bg-accent px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-primary">
            {item.tag}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-3xl italic text-on-surface leading-tight group-hover:text-accent transition-colors">
            {item.name}
          </h3>
          <span className="font-sans text-accent font-bold text-xs pt-2">
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
        Acquire Selection
      </button>
    </motion.div>
  );
}
